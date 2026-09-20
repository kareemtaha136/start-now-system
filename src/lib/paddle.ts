import { resolvePaymentPrice } from "./payments.functions";

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

type PaddleWindow = Window & {
  Paddle?: {
    Environment: { set: (environment: "sandbox" | "production") => void };
    Initialize: (options: { token: string }) => void;
    Checkout: { open: (options: Record<string, unknown>) => void };
  };
};

let initialization: Promise<void> | undefined;

export function getPaymentEnvironment(): "sandbox" | "live" {
  return clientToken?.startsWith("test_") ? "sandbox" : "live";
}

export function initializePayments() {
  if (initialization) return initialization;
  initialization = new Promise<void>((resolve, reject) => {
    if (!clientToken) {
      reject(new Error("Payments are not configured"));
      return;
    }
    const current = (window as PaddleWindow).Paddle;
    if (current) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.onload = () => {
      const paddle = (window as PaddleWindow).Paddle;
      if (!paddle) {
        reject(new Error("Checkout failed to load"));
        return;
      }
      paddle.Environment.set(getPaymentEnvironment() === "sandbox" ? "sandbox" : "production");
      paddle.Initialize({ token: clientToken });
      resolve();
    };
    script.onerror = () => reject(new Error("Checkout failed to load"));
    document.head.appendChild(script);
  });
  return initialization;
}

export async function openPaymentCheckout(priceId: string) {
  await initializePayments();
  const resolvedPriceId = await resolvePaymentPrice({ data: { priceId, environment: getPaymentEnvironment() } });
  const paddle = (window as PaddleWindow).Paddle;
  if (!paddle) throw new Error("Checkout is unavailable");
  paddle.Checkout.open({
    items: [{ priceId: resolvedPriceId, quantity: 1 }],
    settings: {
      displayMode: "overlay",
      successUrl: `${window.location.origin}/checkout/success`,
      allowLogout: false,
      variant: "one-page",
    },
  });
}