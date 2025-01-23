import { describe, expect, test } from "vitest";

import "dotenv/config";
import { WaifuSDK } from "../src";

describe("TokenResearcher", () => {
  test("get", async () => {
    const config = {
      agentId: "test",
      apiKeys: {
        dexscreener: process.env.DEXSCREENER_API_KEY ?? "",
        lunarCrush: process.env.LUNAR_CRUSH_API_KEY ?? "",
        twitter: process.env.TWITTER_API_KEY ?? "",
      },
    };

    const waifusdk = new WaifuSDK(config);
    const data = await waifusdk.token.get({
      address: "D4yF6j16FitfzH6e3Q9yYXTwV1tzpy2yGkjouD5Hpump",
      chain: "solana",
      symbol: "SOL",
    });

    expect(data.pairData).toBeDefined();
    expect(data.marketData).toBeDefined();
    expect(data.socialData).toBeDefined();
  });
});
