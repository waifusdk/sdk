import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import OpenAITransformer from "../../src/transformers/openai";

describe("OpenAITransformer", () => {
  let transformer: OpenAITransformer;
  let openAIStub: any;

  beforeEach(() => {
    // Create a fresh transformer instance for each test
    transformer = new OpenAITransformer({
      apiKey: "test-api-key",
    });

    // Mock the OpenAI chat.completions.create method
    openAIStub = vi.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              mainConcepts: ["test concept"],
              relationships: ["test relationship"],
              context: { source: "test" },
            }),
          },
        },
      ],
    });

    // Mock the OpenAI client using proper type casting
    (transformer as any).client = {
      chat: {
        completions: {
          create: openAIStub,
          _client: undefined,
        },
      },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("transform", () => {
    it("should transform input data using default model", async () => {
      const input = { test: "data" };

      const result = await transformer.transform(input);

      expect(openAIStub).toHaveBeenCalledTimes(1);
      expect(openAIStub).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gpt-3.5-turbo",
          temperature: 0.7,
        })
      );
      expect(result).toEqual({
        mainConcepts: ["test concept"],
        relationships: ["test relationship"],
        context: { source: "test" },
      });
    });

    it("should use specified model from context", async () => {
      const input = { test: "data" };
      const context = {
        model: "gpt-4",
      };

      await transformer.transform(input, context);

      expect(openAIStub).toHaveBeenCalledTimes(1);
      expect(openAIStub).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gpt-4",
        })
      );
    });

    it("should use custom output format", async () => {
      const input = { test: "data" };
      const context = {
        outputFormat: {
          fields: [
            {
              name: "summary",
              description: "Brief summary",
              type: "string" as const,
              required: true,
            },
          ],
        },
      };

      await transformer.transform(input, context);

      expect(openAIStub).toHaveBeenCalledTimes(1);
      const systemMessage = openAIStub.mock.calls[0][0].messages[0].content;
      expect(systemMessage).toContain("Expected output format");
      expect(systemMessage).toContain('"summary": "Brief summary (string)"');
    });

    it("should handle custom prompts", async () => {
      const input = { test: "data" };
      const context = {
        systemPrompt: "Custom system prompt",
        prompt: "Custom user prompt",
      };

      await transformer.transform(input, context);

      expect(openAIStub).toHaveBeenCalledTimes(1);
      const messages = openAIStub.mock.calls[0][0].messages;
      expect(messages[0].content).toBe("Custom system prompt");
      expect(messages[1].content).toBe("Custom user prompt");
    });

    it("should throw error on invalid JSON response", async () => {
      openAIStub.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: "Invalid JSON",
            },
          },
        ],
      });

      await expect(transformer.transform({ test: "data" })).rejects.toThrow(
        "Failed to parse OpenAI response as JSON"
      );
    });

    it("should throw error on empty response", async () => {
      openAIStub.mockResolvedValueOnce({
        choices: [],
      });

      await expect(transformer.transform({ test: "data" })).rejects.toThrow(
        "No response generated from OpenAI"
      );
    });
  });
});
