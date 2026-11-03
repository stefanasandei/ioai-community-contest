type PostHogAttributes = Record<string, string | number | boolean>
type Client = typeof import('posthog-js').default
let client: Client | undefined
let pending: Array<(posthog: Client) => void> = []
let started = false
let failed = false

const isPostHogConfigured = Boolean(
  import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_HOST,
)

export const initializePostHog = (key: string, host: string) => {
  if (started) return
  started = true
  const load = () => {
    void import('posthog-js').then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: host,
        defaults: '2026-05-30',
        capture_exceptions: {
          capture_unhandled_errors: true,
          capture_unhandled_rejections: true,
          capture_console_errors: false,
        },
        logs: {
          serviceName: 'ioai-community-contest-web',
          environment: import.meta.env.MODE,
        },
      })
      client = posthog
      const queued = pending
      pending = []
      queued.forEach(send => send(posthog))
    }).catch(() => {
      failed = true
      pending = []
      // Analytics must never prevent the page from loading.
    })
  }
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(load, { timeout: 2000 })
  else window.setTimeout(load, 0)
}

const sendWhenReady = (send: (posthog: Client) => void) => {
  if (!isPostHogConfigured || failed) return
  if (client) send(client)
  else if (pending.length < 100) pending.push(send)
}

export const capturePostHogEvent = (eventName: string, properties?: PostHogAttributes) => {
  sendWhenReady(posthog => posthog.capture(eventName, properties))
}

export const posthogLogs = {
  info(message: string, attributes: PostHogAttributes) {
    sendWhenReady(posthog => posthog.logger.info(message, attributes))
  },
}
