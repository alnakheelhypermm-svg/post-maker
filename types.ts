
export interface GeneratedContent {
  posts: string[];
  imagePrompt: string;
}

export interface HistoryEntry extends GeneratedContent {
    id: string;
    timestamp: number;
    generatedImage: string;
}

export type AspectRatio = "1:1" | "16:9" | "9:16";

export type ImageStyle = "Realistic Photo" | "Vector Art" | "3D Render" | "Watercolor" | "Minimalist";

export type ImageModel = "imagen-4.0-generate-001" | "gemini-2.5-flash-image";