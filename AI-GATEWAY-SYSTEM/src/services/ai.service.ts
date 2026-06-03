import { ProviderFactory } from './providerFactory';

export class AIService {
  async ask(provider: string, prompt: string) {
    const providerInstance = ProviderFactory.create(provider);

    return providerInstance.generateResponse(prompt);
  }
}