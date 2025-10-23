import { useState } from "react";

export const useModelSelection = (defaultModel = "gpt-4") => {
  const [selectedModel, setSelectedModel] = useState(defaultModel);

  const models = [
    {
      id: "gpt-4",
      name: "GPT-4",
      provider: "OpenAI",
      description: "Most capable model, best for complex tasks",
      color: "#10a37f",
      badge: "Premium",
      responses: {
        greeting:
          "I'm GPT-4 from OpenAI. I understand your question and I'll provide a comprehensive response. This is a simulated response showcasing GPT-4's advanced reasoning capabilities for complex tasks, analysis, and detailed explanations.",
        default:
          "I'm GPT-4, and I can help you with complex reasoning, detailed analysis, and comprehensive solutions to your questions.",
      },
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      provider: "OpenAI",
      description: "Fast and efficient for most tasks",
      color: "#10a37f",
      badge: "Standard",
      responses: {
        greeting:
          "I'm GPT-3.5 Turbo from OpenAI. I can help you with that efficiently. This is a simulated response demonstrating fast and reliable assistance for your everyday tasks and questions.",
        default:
          "I'm GPT-3.5 Turbo, ready to assist you quickly and efficiently with your questions and tasks.",
      },
    },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      provider: "Google",
      description: "Advanced reasoning and multimodal capabilities",
      color: "#4285f4",
      badge: "Premium",
      responses: {
        greeting:
          "I'm Gemini Pro from Google. I can assist with advanced reasoning and multimodal tasks. This simulated response showcases my ability to understand complex queries and provide sophisticated insights.",
        default:
          "I'm Gemini Pro, equipped with advanced reasoning capabilities and multimodal understanding to help with your requests.",
      },
    },
    {
      id: "gemini-flash",
      name: "Gemini Flash",
      provider: "Google",
      description: "Fast responses with good quality",
      color: "#4285f4",
      badge: "Standard",
      responses: {
        greeting:
          "I'm Gemini Flash from Google. I'll provide you with a quick and quality response. This simulated response demonstrates fast processing while maintaining good response quality.",
        default:
          "I'm Gemini Flash, ready to provide quick and quality responses to your questions.",
      },
    },
  ];

  const getCurrentModel = () => {
    return models.find((model) => model.id === selectedModel);
  };

  const getModelResponse = (type = "default") => {
    const model = getCurrentModel();
    return (
      model?.responses?.[type] ||
      model?.responses?.default ||
      "I understand your question. Let me help you with that."
    );
  };

  const changeModel = (modelId) => {
    setSelectedModel(modelId);
  };

  return {
    selectedModel,
    models,
    getCurrentModel,
    getModelResponse,
    changeModel,
  };
};
