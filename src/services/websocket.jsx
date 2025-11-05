import { useCallback, useEffect, useRef, useState } from "react";

// WebSocket connection hook for chat streaming
export const useChatWebSocket = (
  chatId,
  userId,
  accessToken,
  onMessage,
  onError
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  // Get WebSocket URL from environment variables with authentication token
  const getWebSocketUrl = useCallback(() => {
    const baseUrl =
      import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8000";
    // Convert http/https to ws/wss
    const wsProtocol = baseUrl.startsWith("https") ? "wss" : "ws";
    const wsHost = baseUrl.replace(/^https?:\/\//, "");

    // Add token as query parameter for authentication
    const tokenParam = accessToken ? `?token=${accessToken}` : "";
    return `${wsProtocol}://${wsHost}/ws/chat-stream/${userId}/${tokenParam}`;
  }, [userId, accessToken]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!chatId || !userId) {
      console.warn("Cannot connect WebSocket: Missing chatId or userId");
      return;
    }

    if (!accessToken) {
      console.error(
        "Cannot connect WebSocket: Missing access token. Please log in."
      );
      setConnectionError("Authentication required - please log in");
      if (onError) {
        onError(new Error("Authentication required - please log in"));
      }
      return;
    }

    try {
      const wsUrl = getWebSocketUrl();
      console.log(
        "🔌 Connecting to WebSocket:",
        wsUrl.replace(/token=[^&?]+/, "token=***")
      );

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log(
          "✅ WebSocket connected successfully - ready for real-time streaming"
        );
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;

        // Backend is in producer-only mode, no need to send subscribe message
        // Connection is automatically subscribed to user's stream
        console.log("🎧 Listening for messages on chat:", chatId);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);

          // Handle different message types
          switch (data.type) {
            case "llm_frame":
              // Real-time streaming frame from backend
              console.log("📨 Streaming frame received:", data.frame);
              if (onMessage && data.frame) {
                // Check for delta in frame
                const content =
                  data.frame.delta || data.frame.content || data.frame.text;
                if (content) {
                  onMessage({
                    type: "chunk",
                    content: content,
                    chat_id: data.chat_id,
                    user_id: data.user_id,
                  });
                } else {
                  console.warn(
                    "⚠️ Frame received but no content found:",
                    data.frame
                  );
                }
              }
              break;

            case "llm_response":
              // Complete response received
              console.log(
                "✅ Complete response received for chat:",
                data.chat_id
              );
              console.log("Response content:", data.data?.response);
              if (onMessage && data.data?.response) {
                onMessage({
                  type: "complete",
                  content: data.data.response,
                  chat_id: data.chat_id,
                  user_id: data.user_id,
                  model: data.data.model,
                });
              }
              break;

            case "llm_status":
              // Status update from backend
              console.log(`📊 Status: ${data.status} - ${data.message}`);
              if (data.status === "completed" && onMessage) {
                // Notify that streaming is complete
                onMessage({
                  type: "status",
                  status: data.status,
                  message: data.message,
                  chat_id: data.chat_id,
                });
              } else if (data.status === "error" && onError) {
                onError(new Error(data.message || "LLM processing error"));
              }
              break;

            case "response_generated":
              // Alternative complete response format
              console.log("✅ Response generated for chat:", data.chat_id);
              if (onMessage && data.data?.response) {
                onMessage({
                  type: "complete",
                  content: data.data.response,
                  chat_id: data.chat_id,
                  user_id: data.user_id,
                });
              }
              break;

            case "error":
              console.error("❌ WebSocket error message:", data.message);
              if (onError) {
                onError(new Error(data.message));
              }
              break;

            case "pong":
              // Heartbeat response
              console.log("💓 Received pong from server");
              break;

            // Legacy message types (for backward compatibility)
            case "stream_start":
              console.log("Stream started for chat:", data.chat_id);
              break;
            case "stream_chunk":
              if (onMessage) {
                onMessage({
                  type: "chunk",
                  content: data.content,
                  chat_id: data.chat_id,
                });
              }
              break;
            case "stream_end":
              console.log("Stream ended for chat:", data.chat_id);
              if (onMessage) {
                onMessage({
                  type: "complete",
                  content: data.full_response,
                  chat_id: data.chat_id,
                });
              }
              break;

            default:
              console.log("⚠️ Unknown message type:", data.type, data);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionError("WebSocket connection error");
        if (onError) {
          onError(error);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;

        // Attempt to reconnect if not a normal closure
        if (
          event.code !== 1000 &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError("Maximum reconnection attempts reached");
          if (onError) {
            onError(new Error("Failed to reconnect to WebSocket"));
          }
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      setConnectionError(error.message);
      if (onError) {
        onError(error);
      }
    }
  }, [chatId, userId, accessToken, getWebSocketUrl, onMessage, onError]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      console.log("Disconnecting WebSocket...");
      wsRef.current.close(1000, "Client closing connection");
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    } else {
      console.warn("WebSocket is not connected");
      return false;
    }
  }, []);

  // Send ping/heartbeat
  const sendPing = useCallback(() => {
    return sendMessage({ type: "ping" });
  }, [sendMessage]);

  // Effect to manage WebSocket lifecycle
  useEffect(() => {
    if (chatId && userId) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [chatId, userId, connect, disconnect]);

  // Heartbeat interval (every 30 seconds)
  useEffect(() => {
    if (!isConnected) return;

    const heartbeatInterval = setInterval(() => {
      sendPing();
    }, 30000);

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [isConnected, sendPing]);

  return {
    isConnected,
    connectionError,
    sendMessage,
    connect,
    disconnect,
  };
};

// Hook for managing chat streaming with WebSocket
export const useChatStream = (userId, accessToken) => {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const onMessageCallbackRef = useRef(null);
  const onCompleteCallbackRef = useRef(null);
  const onErrorCallbackRef = useRef(null);

  const handleWebSocketMessage = useCallback((data) => {
    if (data.type === "chunk") {
      // Streaming chunk received
      setIsStreaming(true);
      setStreamingMessage((prev) => prev + data.content);

      if (onMessageCallbackRef.current) {
        onMessageCallbackRef.current(data.content);
      }
    } else if (data.type === "complete") {
      // Complete response received
      setIsStreaming(false);

      if (onCompleteCallbackRef.current) {
        onCompleteCallbackRef.current(data.content);
      }

      // Clear streaming message after completion
      setTimeout(() => {
        setStreamingMessage("");
      }, 100);
    } else if (data.type === "status") {
      // Status update received
      console.log("Status update:", data.status, data.message);

      if (data.status === "completed") {
        setIsStreaming(false);
        // Status completion might not have content, so we keep existing message
      }
    }
  }, []);

  const handleWebSocketError = useCallback((error) => {
    console.error("WebSocket streaming error:", error);
    setIsStreaming(false);

    if (onErrorCallbackRef.current) {
      onErrorCallbackRef.current(error);
    }
  }, []);

  const { isConnected, connectionError, sendMessage, disconnect } =
    useChatWebSocket(
      currentChatId,
      userId,
      accessToken,
      handleWebSocketMessage,
      handleWebSocketError
    );

  // Start streaming for a specific chat
  const startStreaming = useCallback((chatId, callbacks = {}) => {
    setCurrentChatId(chatId);
    setStreamingMessage("");
    setIsStreaming(true);

    onMessageCallbackRef.current = callbacks.onMessage || null;
    onCompleteCallbackRef.current = callbacks.onComplete || null;
    onErrorCallbackRef.current = callbacks.onError || null;
  }, []);

  // Stop streaming
  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    setStreamingMessage("");
    disconnect();
  }, [disconnect]);

  return {
    isConnected,
    isStreaming,
    streamingMessage,
    connectionError,
    startStreaming,
    stopStreaming,
    sendMessage,
  };
};

export default useChatWebSocket;
