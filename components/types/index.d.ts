export {};

declare global {
  interface Window {
    initMap: any; // 👈️ turn off type checking
  }
}