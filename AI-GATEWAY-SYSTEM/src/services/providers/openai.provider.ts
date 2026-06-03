import { BaseProvider } from './base.provider';

export class OpenAIProvider extends BaseProvider {
  async generateResponse(prompt: string): Promise<string> {
    const response = await this.client.post('/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return response.data.choices[0].message.content;
  }
}