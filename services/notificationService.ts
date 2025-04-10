import Toast from "react-native-toast-message";

export type ToastType = "success" | "error" | "info";

export class NotificationService {
  /**
   * Show a toast notification to the user
   * @param type The type of toast (success, error, info)
   * @param message1 The main message to display
   * @param message2 Optional secondary message
   * @param duration Optional duration in milliseconds (default: 3000)
   */
  static showToast(type: ToastType, message1: string, message2?: string, duration: number = 5000): void {
    Toast.show({
      type,
      text1: message1,
      text2: message2,
      position: "bottom",
      visibilityTime: duration,
      autoHide: true,
    });
  }

  /**
   * Show a success toast
   */
  static showSuccess(message: string, details?: string): void {
    this.showToast("success", message, details);
  }

  /**
   * Show an error toast
   */
  static showError(message: string, details?: string): void {
    this.showToast("error", message, details);
  }

  /**
   * Show an info toast
   */
  static showInfo(message: string, details?: string): void {
    this.showToast("info", message, details);
  }
}
