import to from "await-to-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface GenerationParams {
    prompt: string;
    negativePrompt?: string;
    steps?: number;
    width?: number;
    height?: number;
    model?: string;
    isPublic?: boolean;
}

export function usePrediction() {
    const [generation, setGeneration] = useState<any>(null);
    const [prediction, setPrediction] = useState<any>(null);
    const [generatedList, setGeneratedList] = useState<any[]>([]);
    const [error, setError] = useState<any>(null);

    function resetState() {
        setPrediction(null);
        setGeneration(null);
        setGeneratedList([]);
    }

    const handleSubmit = async (params: GenerationParams) => {
        resetState();
        
        // Calculate dimensions based on aspect ratio
        let width = 512;
        let height = 512;
        
        if (params.width && params.height) {
            width = params.width;
            height = params.height;
        }

        const [err, response] = await to(
            fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: params.prompt,
                    negativePrompt: params.negativePrompt || "",
                    steps: params.steps || 20,
                    width,
                    height,
                    model: params.model || "schnell",
                    isPublic: params.isPublic
                }),
            })
        );

        if (err) {
            console.error("Generation error:", err.message);
            toast.error(err.message);
            setError(err.message);
            return Promise.reject({ message: err.message });
        }

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error || "Failed to generate image";
            toast.error(errorMessage);
            setError(errorMessage);
            return Promise.reject({ message: errorMessage });
        }

        const result = await response.json();
        setPrediction(result);
        
        if (result.error) {
            toast.error(result.error);
            setError(result.error);
            return Promise.reject({ message: result.error });
        }

        return result;
    };

    return {
        error,
        prediction,
        generation,
        generatedList,
        handleSubmit,
    };
}
