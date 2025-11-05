import { useCallback } from "react";
import { useHttpsApiResponse } from "../contexts/httpsResponseContext";

const chatApi = () => {
  const { get, post } = useHttpsApiResponse();

  const ResponseGenerator = useCallback(
    async (prompt, chat_id) => {
      try {
        if (!chat_id) {
          throw new Error("chat_id is required for generating response");
        }

        const response = await post("api/chat/generate-response/", {
          prompt,
          chat_id,
        });

        console.log("ResponseGenerator full response:", response);

        if (response.success) {
          // Extract the message text from the response object
          const messageText =
            response.response?.message || response.message || response.response;

          return {
            response:
              typeof messageText === "string"
                ? messageText
                : JSON.stringify(messageText),
            success: true,
          };
        }

        throw new Error(response.message || "Failed to generate response");
      } catch (error) {
        console.error("Error in ResponseGenerator:", error);
        throw error;
      }
    },
    [post]
  );

  const initializeChat = useCallback(
    async (prompt) => {
      try {
        const response = await post("api/chat/initialize-llm/");

        console.log("initializeChat full response:", response);

        if (response.success && response.response?.chat_id) {
          const chat_id = response.response.chat_id;
          const llmMessage = await ResponseGenerator(prompt, chat_id);

          console.log("LLM Message:", llmMessage);

          // Return both chat_id and response for proper state management
          return {
            chat_id,
            response: llmMessage.response, // Use .response instead of .message
            success: true,
          };
        }

        throw new Error(response.message || "Failed to initialize chat");
      } catch (error) {
        console.error("Error in initializeChat:", error);
        throw error;
      }
    },
    [post, ResponseGenerator]
  );

  return { initializeChat, ResponseGenerator };
};
export default chatApi;
