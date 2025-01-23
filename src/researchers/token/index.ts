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
    const pairData = await this.dexcreenerProvider.getPair(
      input.chain,
      input.address
    );

    const marketData = await this.lunarCrushProvider.getCoin(input.symbol);

    const tweets = await this.twitterProvider.searchTweets(input.symbol);

    return {
      pairData,
      marketData,
      tweets,
    };
  }
}
