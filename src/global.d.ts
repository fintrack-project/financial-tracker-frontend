export {};

declare global {
  interface Window {
    confirmationResult: any; // Add `confirmationResult` to the `Window` interface
  }
}