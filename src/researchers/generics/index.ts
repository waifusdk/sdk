import { WeatherProvider } from "@waifusdk/providers";
import { type WaifuConfig } from "../../types";
import { BaseResearcher } from "../index";

export class GenericsResearcher extends BaseResearcher {
  weatherProvider: WeatherProvider;
  constructor(config: WaifuConfig) {
    super(config);
    this.weatherProvider = new WeatherProvider({
      apiKey: config.apiKeys["weather"] ?? "",
    });
  }

  async getWeather(city: string) {
    return await this.weatherProvider.getWeather(city);
  }
}
