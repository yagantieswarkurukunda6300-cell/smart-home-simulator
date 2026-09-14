import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { createLiveServer } from './ws-server.js'

const WS_PATH = '/ws'

function liveBridgePlugin() {
  let live = null

  const attach = (server) => {
    if (live) return
    const httpServer = server.httpServer ?? server
    live = createLiveServer({ server: httpServer, path: WS_PATH })
  }

  return {
    name: 'smart-home-live-bridge',
    configureServer(server) {
      attach(server)
    },
    configurePreviewServer(server) {
      attach(server)
    },
    closeBundle() {
      if (live) {
        live.close()
        live = null
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), liveBridgePlugin()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ['**/.live-state*', '**/.live-state*/**'],
    },
  },
  preview: {
    host: true,
    watch: {
      ignored: ['**/.live-state*', '**/.live-state*/**'],
    },
  },
})