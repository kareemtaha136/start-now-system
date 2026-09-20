export type ZeroHoursEvent =
  | "page_view"
  | "free_guide_click"
  | "free_guide_submit"
  | "free_guide_download"
  | "guide_thank_you_view"
  | "pricing_view"
  | "checkout_click"
  | "faq_open"
  | "feature_interaction";

export function trackEvent(name: ZeroHoursEvent, properties?: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("zerohours:analytics", { detail: { name, properties } }));
}