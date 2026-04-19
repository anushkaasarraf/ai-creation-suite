import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImageFromPrompt = async (prompt: string, numberOfImages: number): Promise<string[]> => {
    try {
        const imagePromises = [];
        // The gemini-2.5-flash-image model does not support generating multiple images in a single request.
        // We make parallel requests to generate the desired number of variations.
        for (let i = 0; i < numberOfImages; i++) {
            imagePromises.push(ai.models.generateContent({
                model: 'gemini-2.0-flash-preview-image-generation',
                contents: {
                    parts: [{ text: prompt }]
                },
                config: {
                    // Per documentation, responseModalities is required and should include IMAGE and TEXT.
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            }));
        }

        const responses = await Promise.all(imagePromises);
        const imageUrls: string[] = [];

        for (const response of responses) {
            let imageFound = false;
            if (response.candidates && response.candidates.length > 0) {
                // Find the first part that is an image in the response.
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                        const base64ImageBytes = part.inlineData.data;
                        const mimeType = part.inlineData.mimeType;
                        imageUrls.push(`data:${mimeType};base64,${base64ImageBytes}`);
                        imageFound = true;
                        break; 
                    }
                }
            }
            if (!imageFound) {
                 console.warn("A response from the Gemini API did not contain an image.", response);
            }
        }

        if (imageUrls.length > 0) {
            return imageUrls;
        } else {
            // This case can happen due to safety blocks or other model refusals.
            throw new Error("No images were generated. The model may have refused the prompt due to safety policies. Please adjust your prompt and try again.");
        }
    } catch (error) {
        console.error("Error generating image with Gemini API:", error);
        if (error instanceof Error) {
            if (error.message.includes('SAFETY')) {
                throw new Error("Your prompt was blocked for safety reasons. Please try a different prompt.");
            }
            throw new Error(`API Error: ${error.message}`);
        }
        throw new Error("An unexpected error occurred during image generation.");
    }
};


export const generateCareerRoadmap = async (currentSkills: string, desiredCareer: string): Promise<string> => {
    try {
        const systemInstruction = "You are an expert career advisor named Career Compass AI. Your task is to create a detailed, encouraging, and step-by-step roadmap for a user based on their current skills and desired career. The roadmap must be practical and well-structured. For each major step or phase, provide a clear objective and suggest a mix of high-quality free and paid resources (e.g., specific courses on Coursera/Udemy, YouTube channels, official documentation, books, and online communities). Structure the output in clean, readable Markdown format.";
        
        const contents = `
            **Current Skills:** ${currentSkills}
            **Desired Career:** ${desiredCareer}

            Please generate a personalized career roadmap for me. Break it down into logical phases (e.g., Phase 1: Foundational Knowledge, Phase 2: Practical Application, etc.). For each phase, describe what I need to learn or achieve, and provide links to 2-3 specific, high-quality resources. Start with an encouraging summary.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                systemInstruction,
                temperature: 0.6,
                topK: 40,
            }
        });
        
        const roadmapText = response.text;
        
        if (roadmapText) {
            return roadmapText;
        } else {
            throw new Error("The model did not return a valid response.");
        }
        
    } catch (error) {
        console.error("Error generating career roadmap with Gemini API:", error);
        if (error instanceof Error) {
            if (error.message.includes('SAFETY')) {
                throw new Error("Your request was blocked for safety reasons. Please try different inputs.");
            }
            throw new Error(`API Error: ${error.message}`);
        }
        throw new Error("An unexpected error occurred during roadmap generation.");
    }
};


export const generateStory = async (prompt: string, genre: string, tone: string): Promise<string> => {
    try {
        const systemInstruction = `You are a master storyteller named "AI Muse". Your task is to write a compelling and creative short story based on the user's prompt, desired genre, and tone. The story should be well-structured with a clear beginning, middle, and end. It should be engaging and appropriate for the requested tone. Format the output in clean, readable Markdown.`;
        
        const contents = `
            **Story Prompt:** ${prompt}
            **Genre:** ${genre}
            **Tone:** ${tone}

            Please write a short story based on the details above.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                systemInstruction,
                temperature: 0.8,
                topK: 40,
            }
        });
        
        const storyText = response.text;
        
        if (storyText) {
            return storyText;
        } else {
            throw new Error("The model did not return a valid story.");
        }
        
    } catch (error) {
        console.error("Error generating story with Gemini API:", error);
        if (error instanceof Error) {
            if (error.message.includes('SAFETY')) {
                throw new Error("Your request was blocked for safety reasons. Please try a different prompt.");
            }
            throw new Error(`API Error: ${error.message}`);
        }
        throw new Error("An unexpected error occurred during story generation.");
    }
};