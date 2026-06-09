import axios from 'axios';

export class GeminiProvider {
  async generateResponse(prompt: string) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        }
      );

      return response.data.candidates[0].content.parts[0].text;

    } catch (error: any) {

      console.log(
        JSON.stringify(error.response?.data, null, 2)
      );

      throw error;
    }
  }
}