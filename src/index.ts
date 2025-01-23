import { TokenResearcher } from "./researchers/token";
import { GenericsResearcher } from "./researchers/generics";
import type { WaifuConfig } from "./types";

export * from "./types";

export class WaifuSDK {
  token: TokenResearcher;
  generic: GenericsResearcher;

  constructor(config: WaifuConfig) {
    this.token = new TokenResearcher(config);
    this.generic = new GenericsResearcher(config);
  }
}
