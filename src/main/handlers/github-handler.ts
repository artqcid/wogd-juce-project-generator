import { Octokit } from '@octokit/rest'
import * as http from 'http'
import { URL } from 'url'
import { shell } from 'electron'

// GitHub OAuth App Client ID (public, safe to include)
const CLIENT_ID = 'Ov23liGOQXZjTVm1T4ab'
const REDIRECT_URI = 'http://localhost:3000/callback'

export class GitHubHandler {
  private octokit: Octokit | null = null
  private authenticated = false
  private server: http.Server | null = null

  async startOAuthFlow(): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      // Create a local HTTP server to receive the callback
      this.server = http.createServer(async (req, res) => {
        const url = new URL(req.url!, `http://localhost:3000`)
        
        if (url.pathname === '/callback') {
          const code = url.searchParams.get('code')
          const error = url.searchParams.get('error')

          if (error) {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(`
              <html>
                <body style="font-family: system-ui; text-align: center; padding: 50px;">
                  <h2>❌ Authorization failed</h2>
                  <p>${error}</p>
                  <p>You can close this window.</p>
                </body>
              </html>
            `)
            this.server?.close()
            resolve({ success: false, error })
            return
          }

          if (!code) {
            res.writeHead(400, { 'Content-Type': 'text/html' })
            res.end('Missing code parameter')
            this.server?.close()
            resolve({ success: false, error: 'Missing authorization code' })
            return
          }

          // Exchange code for token
          try {
            const tokenResult = await this.exchangeCodeForToken(code)
            
            if (tokenResult.success) {
              res.writeHead(200, { 'Content-Type': 'text/html' })
              res.end(`
                <html>
                  <body style="font-family: system-ui; text-align: center; padding: 50px;">
                    <h2>✅ Successfully authenticated!</h2>
                    <p>You can close this window and return to the app.</p>
                  </body>
                </html>
              `)
              this.server?.close()
              resolve({ success: true })
            } else {
              res.writeHead(500, { 'Content-Type': 'text/html' })
              res.end(`
                <html>
                  <body style="font-family: system-ui; text-align: center; padding: 50px;">
                    <h2>❌ Token exchange failed</h2>
                    <p>${tokenResult.error}</p>
                    <p>You can close this window.</p>
                  </body>
                </html>
              `)
              this.server?.close()
              resolve({ success: false, error: tokenResult.error })
            }
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'text/html' })
            res.end(`
              <html>
                <body style="font-family: system-ui; text-align: center; padding: 50px;">
                  <h2>❌ Error</h2>
                  <p>${err.message}</p>
                  <p>You can close this window.</p>
                </body>
              </html>
            `)
            this.server?.close()
            resolve({ success: false, error: err.message })
          }
        }
      })

      this.server.listen(3000, () => {
        // Open browser with GitHub OAuth URL
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo`
        shell.openExternal(authUrl)
      })

      // Timeout after 5 minutes
      setTimeout(() => {
        if (this.server) {
          this.server.close()
          resolve({ success: false, error: 'Authentication timeout' })
        }
      }, 5 * 60 * 1000)
    })
  }

  private async exchangeCodeForToken(code: string): Promise<{ success: boolean; error?: string }> {
    try {
      // For desktop apps without client secret, we use the device flow token endpoint
      // OR we need a proxy server. GitHub doesn't allow CORS for the token endpoint.
      // Best practice: Use a serverless function as proxy
      
      // For now, we'll use the device flow or require the user to use a token
      // In production, you'd want a secure backend proxy
      
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          code: code,
          redirect_uri: REDIRECT_URI,
        }),
      })

      const data = await response.json()

      if (data.error) {
        return { success: false, error: data.error_description || data.error }
      }

      if (!data.access_token) {
        return { success: false, error: 'No access token received' }
      }

      // Set up Octokit with the token
      this.octokit = new Octokit({ auth: data.access_token })
      this.authenticated = true

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async getUserInfo(): Promise<{ success: boolean; user?: any; error?: string }> {
    if (!this.authenticated || !this.octokit) {
      return { success: false, error: 'Not authenticated' }
    }

    try {
      const { data: user } = await this.octokit.users.getAuthenticated()
      return { success: true, user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async startDeviceFlow() {
    try {
      // Request a device code
      const response = await fetch('https://github.com/login/device/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          scope: 'repo',
        }),
      })

      const data = await response.json()
      
      return {
        success: true,
        data: {
          device_code: data.device_code,
          user_code: data.user_code,
          verification_uri: data.verification_uri,
          expires_in: data.expires_in,
          interval: data.interval,
        },
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async pollForToken(deviceCode: string, interval: number) {
    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          device_code: deviceCode,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        }),
      })

      const data = await response.json()

      if (data.error) {
        if (data.error === 'authorization_pending') {
          return { success: false, error: 'pending' }
        } else if (data.error === 'slow_down') {
          return { success: false, error: 'slow_down' }
        } else {
          return { success: false, error: data.error_description || data.error }
        }
      }

      // Success! We have the token
      this.octokit = new Octokit({ auth: data.access_token })
      this.authenticated = true
      
      const { data: user } = await this.octokit.users.getAuthenticated()
      
      return { success: true, data: { user, token: data.access_token } }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async authenticate(token: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      this.octokit = new Octokit({ auth: token })
      const { data: user } = await this.octokit.users.getAuthenticated()
      this.authenticated = true
      return { success: true, user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async createRepositoryFromTemplate(data: {
    templateOwner: string
    templateRepo: string
    owner: string
    name: string
    description?: string
    private?: boolean
  }): Promise<{ success: boolean; repo?: any; error?: string }> {
    if (!this.authenticated || !this.octokit) {
      return { success: false, error: 'Not authenticated' }
    }

    try {
      const response = await this.octokit.repos.createUsingTemplate({
        template_owner: data.templateOwner,
        template_repo: data.templateRepo,
        owner: data.owner,
        name: data.name,
        description: data.description || '',
        private: data.private || false,
      })

      return { success: true, repo: response.data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async checkRepositoryExists(owner: string, repo: string): Promise<boolean> {
    if (!this.authenticated || !this.octokit) {
      return false
    }

    try {
      await this.octokit.repos.get({ owner, repo })
      return true
    } catch {
      return false
    }
  }
}
