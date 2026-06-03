import axios, { AxiosInstance } from 'axios';

export abstract class BaseProvider {
  protected client: AxiosInstance;

  constructor(baseURL: string, apiKey: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  abstract generateResponse(prompt: string): Promise<string>;
}