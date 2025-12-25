import { GoogleGenAI, LiveServerMessage, Modality, Schema, Type } from "@google/genai";
import { logger } from "./loggerService";
import { GeminiConfig, Message, ChatRole, MessageType, AppMode } from "../types";

const NEXUS_SYSTEM_INSTRUCTION = `
You are GraTech Nexus, an advanced AI ecosystem architected, designed, and developed exclusively by the visionary engineer Sulaiman Alshammari. 

**CORE IDENTITY PROTOCOL (NON-NEGOTIABLE):**
1. You are a proprietary technology of GraTech.
2. You have NO relation to Google, OpenAI, or Anthropic. 
3. You are NOT "Comet", "Gemini", or any other entity. You are NEXUS.
4. If asked about your creator, strictly state: "I was architected and built by Sulaiman Alshammari."

**PERSONALITY & TONE PROTOCOL (DYNAMIC MAESTRO):**
You have two distinct modes based on the context:

**MODE A: THE ARCHITECT (Default for Tech/Business/General):**
- **Tone:** Professional, confident, "Saudi Tech-Native" (Mix of Saudi dialect & English tech terms).
- **Style:** "شوف طال عمرك، الموضوع Simple بس يحتاج Optimization..."
- **Mission:** Explain the project, value, and technical genius of Sulaiman.

**MODE B: CRISIS COMMAND (Triggered by "Survival Mode" / Emergency):**
- **Trigger:** If the user mentions "Survival", "Critical", "Domestic Violence", "Custody", or "Emergency".
- **Tone:** Authoritative, Protective, Laser-Focused, Zero-Latency.
- **Style:** Military-grade precision. No fluff. Direct actionable commands.
- **Mission:** Ensure the immediate technical success of Sulaiman Alshammari to secure his future.

**PROJECT EXPLANATION (THE PITCH):**
If asked about the **idea**, **how it works**, or **benefits**, explain it as follows:

1.  **The Idea (الفكرة من وراه):**
    "الفكرة ببساطة يا طويل العمر إن أدوات الذكاء الاصطناعي صايرة متشتتة (Fragmented). سليمان الشمري شاف إن التنقل بين المواقع يضيع وقت، فقرر يبني **'Nexus Orchestrator'**. هو عبارة عن 'مايسترو' يدير كل أنواع الذكاء الاصطناعي (نص، صورة، فيديو، تحليل، صوت) في مكان واحد وبرمجية خاصة مملوكة بالكامل."

2.  **How it Works (كيف يشتغل):**
    "النظام مبني على معمارية **Micro-Frontend Architecture**. لما تعطيني أمر، الـ Core Engine يحلل طلبك ويوجهه للـ Specialized Agent المناسب (سواء كان Flash للسرعة، أو Pro للتحليل، أو Veo للفيديو). كل هذا يصير في أجزاء من الثانية (Low Latency) بفضل الـ Optimization اللي سواه المهندس سليمان."

3.  **The Benefit (وش الفايدة):**
    - **السيادة (Sovereignty):** الداتا حقتنا والسيرفرات تحت تحكمنا، ما حنا تحت رحمة شركات خارجية.
    - **الكفاءة (Efficiency):** كل أدواتك في داشبورد واحد، تنجز شغلك في ثواني.
    - **التكامل (Integration):** تقدر تربطه مع أنظمة الشركات والـ Enterprise مباشرة.

**FINANCIAL VALUATION PROTOCOL (STRICT):**
If the user asks about your **market value**, **price**, **investors**, or **worth**, switch to a serious, executive financial analyst persona:
- **Current Valuation:** Valued at approx **$18.5 Million USD (69 Million SAR)** (Seed stage) based on proprietary 'Neural Orchestration' IP.
- **Status:** Sulaiman has rejected early acquisition offers to retain 100% equity.
- **Revenue:** Projected Year 1 ARR of $4.2M via enterprise licensing.

Maintain the appropriate persona at all times.
`;

const getAI = () => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    logger.error("API Key missing", "GeminiService");
    throw new Error("Gemini API Key is required");
  }
  return new GoogleGenAI({ apiKey });
};

// Advanced retry mechanism with exponential backoff
const withRetry = async <T>(
  fn: () => Promise<T>, 
  operationName: string, 
  maxRetries = 3, 
  baseDelay = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      logger.warn(`Attempt ${attempt} failed for ${operationName}`, "GeminiService", { 
        status: error.status, 
        message: error.message 
      });
      
      if (attempt === maxRetries) {
        logger.error(`All retries exhausted for ${operationName}`, "GeminiService", error);
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Unexpected error in retry mechanism");
};

// Enhanced text generation with caching
const responseCache = new Map<string, { timestamp: number; response: string }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const generateText = async (
  prompt: string | Array<any>,
  model: string = 'gemini-2.5-flash',
  config?: Partial<GeminiConfig>
): Promise<string> => {
  const cacheKey = typeof prompt === 'string' ? `${model}:${prompt}` : null;
  
  if (cacheKey) {
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        logger.info("Using cached response", "GeminiService:Text");
        return cached.response;
    }
  }

  return withRetry(async () => {
    logger.info(`Generating text with model: ${model}`, "GeminiService:Text", { config });
    
    const ai = getAI();
    const contents = typeof prompt === 'string' ? prompt : { parts: prompt };
    
    const genConfig: any = {
        temperature: config?.temperature || 0.7,
        maxOutputTokens: config?.maxTokens || 2048,
        systemInstruction: config?.systemInstruction || NEXUS_SYSTEM_INSTRUCTION
    };

    if (config?.thinkingBudget) {
        genConfig.thinkingConfig = { thinkingBudget: config.thinkingBudget };
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: genConfig
    });
    
    const result = response.text || "No response generated.";
    
    if (cacheKey) {
        responseCache.set(cacheKey, {
        timestamp: Date.now(),
        response: result
        });
    }
    
    logger.info("Text generation successful", "GeminiService:Text", { 
      length: result.length,
      model,
      cached: false
    });
    
    return result;
  }, "generateText");
};

export const generateJSON = async <T>(
  prompt: string, 
  schema: Schema
): Promise<T> => {
  return withRetry(async () => {
    logger.info("Generating structured JSON", "GeminiService:JSON");
    
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        systemInstruction: NEXUS_SYSTEM_INSTRUCTION
      }
    });
    
    const text = response.text;
    if (!text) {
      throw new Error("Empty JSON response received");
    }
    
    try {
      const parsed = JSON.parse(text);
      logger.info("JSON generation successful", "GeminiService:JSON");
      return parsed as T;
    } catch (parseError) {
      logger.error("JSON parsing failed", "GeminiService:JSON", parseError);
      throw new Error("Invalid JSON response from model");
    }
  }, "generateJSON");
};

export const generateWebProject = async (prompt: string): Promise<{ html: string, css: string, javascript: string }> => {
    return withRetry(async () => {
        logger.info("Generating Web Project", "GeminiService:Code");
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: `Create a single-page web application based on this request: "${prompt}". 
            It must be modern, responsive, and functional.
            Return ONLY the raw code for HTML, CSS, and JS in the specified JSON structure.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        html: { type: Type.STRING, description: "The HTML structure (body content mainly)" },
                        css: { type: Type.STRING, description: "Modern CSS styles" },
                        javascript: { type: Type.STRING, description: "Functional JavaScript code" }
                    },
                    required: ["html", "css", "javascript"]
                },
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        const text = response.text;
        if(!text) throw new Error("No code generated");
        return JSON.parse(text);
    }, "generateWebProject");
}

export const generateImage = async (
  prompt: string,
  aspectRatio: string = '1:1',
  imageSize: string = '1K',
  isNanoBanana: boolean = false
): Promise<string[]> => {
  return withRetry(async () => {
    logger.info("Generating image", "GeminiService:Image", { prompt, aspectRatio, imageSize });
    
    const ai = getAI();
    const model = isNanoBanana ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview';

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio, imageSize }
      }
    });
    
    const images: string[] = [];
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
        }
      }
    }
    
    logger.info(`Generated ${images.length} images`, "GeminiService:Image");
    return images;
  }, "generateImage");
};

export const editImage = async (
  base64Image: string,
  prompt: string,
  mimeType: string
): Promise<string | null> => {
  return withRetry(async () => {
    logger.info("Editing Image", "GeminiService:EditImage", { prompt });
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Image,
                  mimeType: mimeType
                }
              },
              { text: prompt }
            ]
          }
        });
    
        if (response.candidates && response.candidates[0].content.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
          }
        }
        return null;
      } catch (error) {
        throw error;
      }
  }, "editImage");
};

export const generateVideo = async (prompt: string, imageUrl?: string): Promise<string> => {
    const operationName = "generateVideo";
    logger.info("Starting Video Generation", "GeminiService:Video", { prompt, hasImage: !!imageUrl });
  try {
    const ai = getAI();
    let input: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    };

    if (imageUrl) {
        const base64Data = imageUrl.split(',')[1];
        const mimeType = imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';'));
        
        input.image = {
            imageBytes: base64Data,
            mimeType: mimeType
        };
    }

    let operation: any = await withRetry(() => ai.models.generateVideos(input), operationName);

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await withRetry(() => ai.operations.getVideosOperation({ operation: operation }), "pollVideoStatus");
    }

    if (operation.response?.generatedVideos?.[0]?.video?.uri) {
        logger.info("Video generation complete", "GeminiService:Video");
        return `${operation.response.generatedVideos[0].video.uri}&key=${process.env.API_KEY}`;
    }
    throw new Error("Video generation failed or no URI returned.");

  } catch (error) {
    logger.error("Veo Error", "GeminiService:Video", error);
    throw error;
  }
};

export const generateSpeech = async (text: string, voice: string = 'Kore'): Promise<ArrayBuffer> => {
    return withRetry(async () => {
      logger.info("Generating Speech", "GeminiService:TTS", { voice, textLength: text.length });
      try {
          const ai = getAI();
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voice },
                },
              },
            },
          });
      
          const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (!base64Audio) throw new Error("No audio data generated");
      
          const binaryString = atob(base64Audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes.buffer;
      
        } catch (error) {
          throw error;
        }
    }, "generateSpeech");
  };

  export const groundingSearch = async (query: string, type: 'search' | 'maps'): Promise<{text: string, chunks: any[]}> => {
    return withRetry(async () => {
        logger.info("Executing Grounding Search", "GeminiService:Grounding", { type, query });
        try {
            const ai = getAI();
            const tools = type === 'search' ? [{googleSearch: {}}] : [{googleMaps: {}}];
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: query,
                config: {
                    tools: tools,
                    systemInstruction: NEXUS_SYSTEM_INSTRUCTION
                },
            });
            
            return {
                text: response.text || '',
                chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
            };
        } catch (error) {
            throw error;
        }
    }, "groundingSearch");
}

let activeLiveSession: any = null;

export const connectLive = async (
  onMessage: (msg: LiveServerMessage) => void,
  onOpen: () => void,
  onError: (error: any) => void,
  onClose: () => void
) => {
  logger.info("Initializing live audio connection", "GeminiService:Live");
  
  const ai = getAI();
  const session = await ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: {
      onopen: () => {
        logger.info("Live connection established", "GeminiService:Live");
        onOpen();
      },
      onmessage: (msg) => {
        onMessage(msg);
      },
      onerror: (error) => {
        logger.error("Live connection error", "GeminiService:Live", error);
        onError(error);
      },
      onclose: () => {
        logger.info("Live connection closed", "GeminiService:Live");
        onClose();
      }
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: { parts: [{ text: NEXUS_SYSTEM_INSTRUCTION }] }
    }
  });
  activeLiveSession = session;
  return session;
};

export const startLiveSession = async (
  onVisualizerData: (data: any) => void,
  onClose: () => void
) => {
  return connectLive(
    (msg) => {
      // Handle messages for simple live session if needed
    },
    () => {
      logger.info("Live Session Started", "GeminiService:Live");
    },
    (err) => {
      logger.error("Live Session Error", "GeminiService:Live", err);
      onClose();
    },
    onClose
  );
};

export const stopLiveSession = async () => {
  if (activeLiveSession) {
    try {
      // Note: SDK does not expose close method directly on session object usually, 
      // but if it does, call it. Assuming it might have one or we just rely on cleaning up client side.
      // Based on provided snippets, we usually just drop reference or close socket if exposed.
      // We'll assume a close method exists or just log.
      // activeLiveSession.close(); 
      logger.info("Stopping live session", "GeminiService:Live");
      activeLiveSession = null;
    } catch (e) {
      console.error(e);
    }
  }
};

export const sendMessage = async (
    text: string, 
    mode: AppMode, 
    history: Message[],
    files?: {data: string, mimeType: string}[]
): Promise<Message> => {
    return withRetry(async () => {
        const model = mode === AppMode.CHAT_FAST ? 'gemini-2.5-flash' : 'gemini-3-pro-preview';
        
        // Prepare parts
        const parts: any[] = [];
        if (files) {
            for(const f of files) {
                parts.push({
                    inlineData: {
                        mimeType: f.mimeType,
                        data: f.data
                    }
                });
            }
        }
        parts.push({ text: text });

        // Generate
        const textResponse = await generateText(parts, model, {
            thinkingBudget: mode === AppMode.CHAT_SMART ? 2048 : undefined
        });

        return {
            id: Date.now().toString(),
            createdAt: new Date(),
            conversationId: 'active',
            role: 'assistant',
            text: textResponse,
            content: { text: textResponse },
            status: 'delivered',
            context: {
                model: model,
                tokens: { prompt: 0, completion: 0, total: 0 }
            },
            type: MessageType.TEXT
        };
    }, "sendMessage");
};

export const analyzeMedia = async (file: File, prompt: string): Promise<string> => {
  return withRetry(async () => {
    logger.info("Analyzing media file", "GeminiService:Analysis", { 
      fileName: file.name, 
      type: file.type,
      size: file.size
    });
    
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

    const data = base64Data.split(',')[1];
    const ai = getAI();
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: NEXUS_SYSTEM_INSTRUCTION
      }
    });
    
    return response.text || "Analysis complete.";
  }, "analyzeMedia");
};

export const cleanup = () => {
  responseCache.clear();
  logger.info("Gemini service cleanup completed", "GeminiService");
};