# WaifuSDK

<div align="center">
  <img src="./assets/banner.jpeg" alt="WaifuSDK Banner" width="100%" />
</div>

A TypeScript SDK for interacting with Waifu services. This SDK provides a simple and intuitive interface accessing live and historic data using [@waifusdk/providers](https://github.com/waifusdk/providers).

## Demo Video

https://youtu.be/Gw7DDG22sT0

## Installation

```bash
npm install @waifusdk/sdk
# or
yarn add @waifusdk/sdk
# or
pnpm add @waifusdk/sdk
```

## Usage

```typescript
import { WaifuSDK } from "@waifusdk/sdk";

// Initialize the SDK with your configuration
const sdk = new WaifuSDK({
  // Add your configuration here
});

// Use the token researcher
await sdk.token.someMethod();

// Use the generic researcher
await sdk.generic.someMethod();
```

## Features

- Token Research Operations
- Generic Research Capabilities
- TypeScript Support
- Modern ESM and CommonJS Support

## API Reference

### WaifuSDK

The main class that provides access to all SDK functionality.

#### Configuration

```typescript
interface WaifuConfig {
  // Add configuration options here
}
```

### Modules

- `TokenResearcher`: Handles token-related operations
- `GenericsResearcher`: Provides generic research capabilities

## Contributing

We welcome contributions to WaifuSDK! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding New Data Providers

WaifuSDK is designed to be extensible with new data providers. If you want to add support for a new data source:

1. Visit our providers repository at [github.com/waifusdk/providers](https://github.com/waifusdk/providers)
2. Follow the provider implementation guidelines in the repository
3. Submit your provider as a pull request

Make sure to:

- Write tests for your provider
- Document your provider's functionality
- Follow the existing code style
- Update the provider's README with usage examples

## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Lint the codebase
pnpm lint
```

## License

MIT License
