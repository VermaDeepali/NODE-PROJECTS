import { OpenAIProvider } from './providers/openai.provider';
import { GeminiProvider } from './providers/gemini.provider';

export class ProviderFactory {
  static create(provider: string) {
    switch (provider) {
      case 'openai':
        return new OpenAIProvider(
          'https://api.openai.com/v1',
          process.env.OPENAI_API_KEY!
        );

      case 'gemini':
        return new GeminiProvider();

      default:
        throw new Error('Unsupported provider');
    }
  }
}