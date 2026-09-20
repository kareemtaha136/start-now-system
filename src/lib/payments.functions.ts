import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { gatewayFetch, type PaddleEnv } from "./paddle.server";

export const resolvePaymentPrice = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ priceId: z.string().min(1), environment: z.enum(["sandbox", "live"]) }).parse(data))
  .handler(async ({ data }) => {
    const response = await gatewayFetch(data.environment as PaddleEnv, `/prices?external_id=${encodeURIComponent(data.priceId)}`);
    if (!response.ok) throw new Error("Unable to load checkout price");
    const result = await response.json() as { data?: Array<{ id: string }> };
    const price = result.data?.[0];
    if (!price) throw new Error("Checkout price not found");
    return price.id;
  });