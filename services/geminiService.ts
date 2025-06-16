
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Recipe } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

if (!process.env.API_KEY) {
  console.error("API_KEY 환경 변수가 설정되지 않았습니다. Gemini API를 호출할 수 없습니다.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generateKoreanRecipePrompt = (ingredients: string): string => {
  return `
당신은 도움이 되는 요리 보조원입니다.
다음 주요 재료가 주어졌습니다: ${ingredients}.
이 재료들을 사용하여 30분 이내에 만들 수 있는 간단한 요리법을 하나 이상 제안해 주세요.
소금, 후추, 설탕, 기름, 마늘, 간장, 고추장, 고춧가루와 같은 기본 양념은 사용 가능하다고 가정하며, 사용자가 제공한 주요 재료 목록에는 포함시키지 마세요. 제공된 재료가 주요리가 되는 레시피에 집중해 주세요.

각 레시피에 대해 다음 정보를 한국어로 JSON 형식으로 제공해 주세요. 추가로, 각 요리의 이미지를 나타내는 공개적으로 접근 가능한 URL을 "recipeImageUrl" 필드에 포함해주세요. 적절한 이미지 URL을 찾을 수 없는 경우, 이 필드를 생략하거나 null로 설정할 수 있습니다.
각 객체가 다음 키를 갖는 객체의 배열 형태여야 합니다:
- "recipeName": string (요리 이름)
- "estimatedTime": string (예: "20분", "30분 이내")
- "requiredIngredients": string[] (필요한 모든 재료 목록. 사용자가 제공한 주요 재료를 바탕으로 추가한 일반적인 재료도 포함)
- "instructions": string[] (단계별 요리 지침)
- "recipeImageUrl": string | null (요리 이미지 URL. 찾을 수 없는 경우 null 또는 생략 가능)

JSON 출력 예시 (한국어):
[
  {
    "recipeName": "간단 닭고기 볶음",
    "estimatedTime": "25분",
    "requiredIngredients": ["닭가슴살, 채썬 것", "양파 1개, 슬라이스", "파프리카 1개, 슬라이스", "간장 2큰술", "참기름 1큰술", "다진 마늘 1작은술", "소금과 후추 약간", "밥 (선택 사항)"],
    "instructions": [
      "중불로 달군 팬이나 웍에 기름을 두릅니다.",
      "닭고기를 넣고 갈색이 되고 완전히 익을 때까지 볶습니다.",
      "양파와 파프리카를 넣고 3-5분간 숨이 죽을 정도로 볶습니다.",
      "작은 그릇에 간장, 참기름, 다진 마늘을 섞습니다.",
      "소스를 볶음 요리에 붓고 골고루 섞습니다. 소금과 후추로 간을 합니다.",
      "원한다면 밥과 함께 뜨겁게 제공합니다."
    ],
    "recipeImageUrl": "https://example.com/images/chicken_stir_fry.jpg"
  }
]

출력은 JSON 배열만 포함해야 합니다. JSON 앞뒤로 다른 텍스트를 포함하지 마십시오.
`;
};

export const fetchRecipesFromIngredients = async (ingredients: string): Promise<Recipe[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY가 설정되지 않았습니다. Gemini API를 사용할 수 없습니다.");
  }
  
  const prompt = generateKoreanRecipePrompt(ingredients);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7, 
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    if (Array.isArray(parsedData) && parsedData.every(isValidRecipe)) {
      return parsedData.map(recipe => ({
        ...recipe,
        recipeImageUrl: recipe.recipeImageUrl || null, // Ensure null if undefined/empty
      })) as Recipe[];
    } else {
      console.error("API 응답이 예상된 레시피 배열 형식이 아닙니다:", parsedData);
      throw new Error("레시피 데이터를 파싱하는 데 실패했습니다. 형식이 올바르지 않습니다.");
    }
  } catch (error) {
    console.error("Gemini API 호출 중 오류 발생:", error);
    if (error instanceof Error) {
        if (error.message.includes("API_KEY")) {
             throw new Error("Gemini API 키 구성에 문제가 있습니다. 관리자에게 문의하세요.");
        }
         throw new Error(`레시피를 가져오는 중 오류가 발생했습니다: ${error.message}`);
    }
    throw new Error("알 수 없는 오류로 레시피를 가져오지 못했습니다.");
  }
};

const isValidRecipe = (item: any): item is Recipe => {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.recipeName === 'string' &&
    typeof item.estimatedTime === 'string' &&
    Array.isArray(item.requiredIngredients) &&
    item.requiredIngredients.every((ing: any) => typeof ing === 'string') &&
    Array.isArray(item.instructions) &&
    item.instructions.every((step: any) => typeof step === 'string') &&
    (typeof item.recipeImageUrl === 'string' || item.recipeImageUrl === null || typeof item.recipeImageUrl === 'undefined')
  );
};