import { type WaifuConfig } from "../types";

export abstract class BaseResearcher {
  protected config: WaifuConfig;

  constructor(config: WaifuConfig) {
    this.config = config;
  }

  async get(...input: any[]): Promise<any> {
    throw new Error("Not implemented");
  }
}
