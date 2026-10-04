import posthog from 'posthog-js'

type PostHogAttributes = Record<string, string | number | boolean>

const isPostHogConfigured = Boolean(
  import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_HOST,
)

export const capturePostHogEvent = (eventName: string, properties?: PostHogAttributes) => {
  if (isPostHogConfigured) {
    posthog.capture(eventName, properties)
  }
}

export const posthogLogs = {
  info(message: string, attributes: PostHogAttributes) {
    if (isPostHogConfigured) {
      posthog.logger.info(message, attributes)
    }
  },
}
