import { posthog } from "./posthog";
import { NotificationService } from "./notificationService";

export class LoggingService {
  /**
   * Handle an error by showing a toast and logging to PostHog
   * @param error The error object
   * @param context Additional context information
   * @param showToast Whether to show a toast notification (default: true)
   */
  static handleError(error: Error | unknown, context: Record<string, any> = {}, showToast: boolean = true): void {
    // Extract error message
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Log to console
    console.error(`[Error] ${errorMessage}`, error, context);

    // Show toast if enabled
    if (showToast) {
      NotificationService.showError(
        "An error occurred",
        errorMessage.length > 100 ? `${errorMessage.substring(0, 100)}...` : errorMessage
      );
    }

    // Send to PostHog
    try {
      posthog.capture("error", {
        error_message: errorMessage,
        error_stack: error instanceof Error ? error.stack : undefined,
        ...context,
      });
    } catch (posthogError) {
      console.error("[LoggingService] Failed to send error to PostHog:", posthogError);
    }
  }

  /**
   * Log an event to PostHog
   * @param eventName The name of the event
   * @param properties Additional properties for the event
   */
  static logEvent(eventName: string, properties: Record<string, any> = {}): void {
    try {
      posthog.capture(eventName, properties);
    } catch (error) {
      console.error(`[LoggingService] Failed to log event ${eventName}:`, error);
    }
  }
}
