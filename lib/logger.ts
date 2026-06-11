import * as Sentry from "@sentry/nextjs"

type LogContext = Record<string, unknown>

const isSentryEnabled = !!process.env.SENTRY_DSN

export const logger = {
  info(message: string, context?: LogContext) {
    console.log(`[INFO] ${message}`, context ?? "")
    if (isSentryEnabled) {
      Sentry.addBreadcrumb({ category: "info", message, data: context, level: "info" })
    }
  },

  warn(message: string, context?: LogContext) {
    console.warn(`[WARN] ${message}`, context ?? "")
    if (isSentryEnabled) {
      Sentry.addBreadcrumb({ category: "warn", message, data: context, level: "warning" })
    }
  },

  error(message: string, error?: unknown, context?: LogContext) {
    console.error(`[ERROR] ${message}`, error ?? "", context ?? "")
    if (isSentryEnabled) {
      Sentry.withScope((scope) => {
        if (context) scope.setExtras(context)
        if (error instanceof Error) {
          scope.setExtra("originalError", error.message)
          Sentry.captureException(error)
        } else {
          Sentry.captureMessage(message, { level: "error", extra: context })
        }
      })
    }
  },
}
