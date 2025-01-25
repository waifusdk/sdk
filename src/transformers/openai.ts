import OpenAI from 'openai';

export interface TransformerConfig {
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
}

export interface TransformationContext {
  prompt?: string;
  systemPrompt?: string;
  model?: string;
  outputFormat?: {
    fields: Array<{
      name: string;
      description: string;
      type: 'string' | 'number' | 'boolean' | 'array' | 'object';
      required?: boolean;
    }>;
  };
}

export class OpenAITransformer {
  private client: OpenAI;
  private config: TransformerConfig;

  constructor(config: TransformerConfig) {
    this.config = {
      temperature: 0.7,
      maxTokens: 1000,
      ...config
    };
    this.client = new OpenAI({
      apiKey: this.config.apiKey
    });
  }

  private generateSystemPrompt(context?: TransformationContext): string {
    if (context?.systemPrompt) return context.systemPrompt;

    const formatInstructions = context?.outputFormat?.fields
      ? `\nExpected output format:
        {
          ${context.outputFormat.fields
            .map(field => `"${field.name}": "${field.description} (${field.type})"`)
            .join(',\n          ')}
        }\n`
      : '';

    return `You are a data transformation expert. Your task is to analyze the input data and transform it into a highly contextual format that will be valuable for subsequent AI processing.

Key objectives:
1. Extract and highlight key information, relationships, and patterns
2. Maintain semantic meaning while removing noise and redundancy
3. Structure the output in a way that maximizes context understanding
4. Preserve important metadata and relationships
5. Add relevant contextual information when beneficial

Guidelines:
- Identify and extract core concepts and entities
- Preserve relationships between different data elements
- Include relevant metadata that aids understanding
- Remove redundant or non-essential information
- Structure output in a clear, hierarchical format
- Add explanatory context where beneficial${formatInstructions}

Ensure the output is valid JSON and follows any specified format requirements.`;
  }

  private generateUserPrompt(input: any, context?: TransformationContext): string {
    return context?.prompt || `Please transform the following data into a rich, contextual format that will be valuable for AI processing. 
Focus on extracting key information, relationships, and patterns while maintaining semantic accuracy.

Input data:
${JSON.stringify(input, null, 2)}`;
  }

  async transform<T>(
    input: any,
    context?: TransformationContext
  ): Promise<T> {
    try {
      const systemMessage = this.generateSystemPrompt(context);
      const userPrompt = this.generateUserPrompt(input, context);

      const response = await this.client.chat.completions.create({
        model: context?.model || 'gpt-3.5-turbo',
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ]
      });

      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No response generated from OpenAI');
      }

      try {
        return JSON.parse(result) as T;
      } catch (e) {
        throw new Error('Failed to parse OpenAI response as JSON');
      }
    } catch (error) {
      throw new Error(`Transformation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default OpenAITransformer;
