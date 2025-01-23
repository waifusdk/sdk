import {
  BaseProvider,
  DexScreenerProvider,
  LunarCrushProvider,
  TwitterProvider,
} from "@waifusdk/providers";
import { type WaifuConfig } from "../../types";
import { BaseResearcher } from "../index";

interface TokenInput {
  address: string;
  chain: string;
  symbol: string;
}

export class TokenResearcher extends BaseResearcher {
  dexcreenerProvider: DexScreenerProvider;
  lunarCrushProvider: LunarCrushProvider;
  twitterProvider: TwitterProvider;
  constructor(config: WaifuConfig) {
    super(config);
    this.dexcreenerProvider = new DexScreenerProvider();
    this.lunarCrushProvider = new LunarCrushProvider({
      apiKey: config.apiKeys["lunarCrush"] ?? "",
    });
    this.twitterProvider = new TwitterProvider({
      apiKey: config.apiKeys["twitter"] ?? "",
    });
  }

  async get(input: TokenInput) {
    const [pairData, marketData, socialData, tweets] = await Promise.all([
      this.dexcreenerProvider.getTokenPairs(input.chain, input.address),
      this.lunarCrushProvider.getCoin(input.symbol),
      this.lunarCrushProvider.getSocialData(input.symbol),
      this.twitterProvider.searchTweets(input.symbol),
    ]);

    return {
      pairData,
      marketData,
      tweets,
      socialData,
    };
  }
}
