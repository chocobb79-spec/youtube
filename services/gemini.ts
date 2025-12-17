import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ScriptAnalysis } from "../types";

let currentApiKey = '';

export const setApiKey = (apiKey: string) => {
  currentApiKey = apiKey;
};

const getAI = () => {
  if (!currentApiKey) {
    throw new Error('API 키가 설정되지 않았습니다.');
  }
  return new GoogleGenAI({ apiKey: currentApiKey });
};

// Schema for the analysis response to ensure strict JSON structure
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    structureSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A step-by-step breakdown of the script's structure (e.g., Hook, Intro, Problem, Solution, Climax, CTA).",
    },
    toneAndStyle: {
      type: Type.STRING,
      description: "Description of the script's tone, pacing, and language style.",
    },
    hookStrategy: {
      type: Type.STRING,
      description: "Analysis of how the script grabs attention in the first 30 seconds.",
    },
    suggestedTopics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ["id", "title", "reason"],
      },
      description: "4 viral topic ideas that would work well with this exact structure.",
    },
  },
  required: ["structureSteps", "toneAndStyle", "hookStrategy", "suggestedTopics"],
};

export const analyzeScriptAndSuggestTopics = async (sourceScript: string): Promise<ScriptAnalysis> => {
  const ai = getAI();
  const model = "gemini-1.5-flash"; // 무료 모델
  
  const prompt = `
    당신은 유튜브 알고리즘 및 콘텐츠 전략 전문가입니다.
    사용자가 제공한 유튜브 영상 대본을 심층 분석하여 구조화하고, 동일한 성공 방정식을 적용할 수 있는 새로운 주제를 제안해주세요.
    
    분석할 대본:
    """
    ${sourceScript.slice(0, 30000)}
    """
    
    다음 내용을 JSON 포맷으로 정확하게 출력하세요:
    1. structureSteps: 대본의 흐름을 논리적인 단계별(Hook, 서론, 본론 포인트들, 결론 등)로 요약.
    2. toneAndStyle: 화자의 어조, 문체, 속도감 분석.
    3. hookStrategy: 초반 시청 지속 시간을 늘리기 위해 사용된 후킹 전략 분석.
    4. suggestedTopics: 이 구조와 톤을 그대로 적용했을 때 대박날 수 있는 서로 다른 니치의 새로운 주제 4가지.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as ScriptAnalysis;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generateNewScript = async (
  topicTitle: string,
  analysis: ScriptAnalysis
): Promise<string> => {
  const ai = getAI();
  const model = "gemini-1.5-flash"; // 무료 모델

  const structureText = analysis.structureSteps.join(" -> ");
  
  const prompt = `
    당신은 100만 유튜버의 전속 메인 작가입니다.
    
    목표: '${topicTitle}'라는 주제로 새로운 유튜브 대본을 작성하세요.
    
    필수 지침:
    1. 구조 준수: 반드시 다음 구조 흐름을 그대로 따라가야 합니다: [${structureText}]
    2. 톤앤매너: 다음 스타일을 유지하세요: ${analysis.toneAndStyle}
    3. 후킹 전략: 초반 도입부는 다음 전략을 응용하세요: ${analysis.hookStrategy}
    4. 언어: 한국어 (자연스러운 구어체)
    5. 형식: Markdown 형식을 사용하여 가독성 있게 작성하세요 (볼드체, 구분선 등 활용).
    
    대본을 지금 작성해 주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        // We want free-form markdown text here, not JSON
        temperature: 0.8,
      },
    });

    return response.text || "대본 생성에 실패했습니다.";
  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
};
