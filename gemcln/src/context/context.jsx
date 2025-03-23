import { createContext, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [selectedModel, setSelectedModel] = useState("gemini");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        const finalPrompt = prompt || input;

        try {
            // ✅ Using environment variable for API URL
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${selectedModel}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: finalPrompt }),
            });

            if (!response.ok) {
                throw new Error("API request failed");
            }

            const data = await response.json();
            let formattedResponse = data.response;

            if (selectedModel === "gemini") {
                formattedResponse = formattedResponse
                    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold text
                    .replace(/\*/g, "<br/>"); // Line breaks
            }

            if (!prompt) {
                setPrevPrompts((prev) => [...prev, input]);
            }
            setRecentPrompt(finalPrompt);

            const responseArray = formattedResponse.split(" ");

            for (let i = 0; i < responseArray.length; i++) {
                delayPara(i, responseArray[i] + " ");
            }
        } catch (error) {
            console.error("API Error:", error);
            setResultData("Error processing your request");
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    const contextValues = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        selectedModel,
        setSelectedModel,
    };

    return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};

export default ContextProvider;
