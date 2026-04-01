import { GoogleGenAI, Modality, Type, GenerateContentResponse, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  // 1. Google Search Grounding
  async searchLocalInfo(query: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      return {
        text: response.text,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
      };
    } catch (error) {
      console.error("Error in searchLocalInfo:", error);
      throw error;
    }
  },

  // 2. Multi-turn Chatbot
  createChat() {
    return ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction: "Eres ÁO Conecta, el asistente virtual oficial de la Alcaldía Álvaro Obregón, CDMX. Tu objetivo es ayudar a los vecinos con información sobre negocios locales, servicios ciudadanos, transporte y bienestar. Eres amable, eficiente y conoces muy bien la zona de San Ángel, Las Águilas, Olivar del Conde, etc.",
      },
    });
  },

  // 3. Video Generation
  async generateVideo(prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') {
    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: aspectRatio,
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const response = await fetch(downloadLink!, {
        method: 'GET',
        headers: {
          'x-goog-api-key': process.env.GEMINI_API_KEY || "",
        },
      });
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error in generateVideo:", error);
      throw error;
    }
  },

  // 4. Text-to-Speech
  async textToSpeech(text: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const binary = atob(base64Audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/wav' });
        return URL.createObjectURL(blob);
      }
      return null;
    } catch (error) {
      console.error("Error in textToSpeech:", error);
      throw error;
    }
  }
};
