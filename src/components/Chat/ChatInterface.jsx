import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Send,
  AttachFile,
  Mic,
  Stop,
  AutoAwesome,
  ModelTraining,
  SupportAgent,
  SmartToy,
} from "@mui/icons-material";
import LoadingMessage from "./LoadingMessage";
import ModelSelector from "./ModelSelector";
import { useModelSelection } from "../../hooks";
import chatApi from "../../services/chatApi";
import { useChatStream } from "../../services/websocket";
import { useAuth } from "../../contexts/AuthContext";

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const { selectedModel, getCurrentModel, getModelResponse, changeModel } =
    useModelSelection();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm Magure AI, your intelligent assistant. How can I help you today?",
      timestamp: new Date(),
      model: "gpt-4",
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const { initializeChat, ResponseGenerator } = chatApi();
  const { user, accessToken } = useAuth();

  // WebSocket streaming state
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const {
    isConnected: wsConnected,
    isStreaming,
    streamingMessage,
    connectionError: wsError,
    startStreaming,
    stopStreaming,
  } = useChatStream(user?.id || user?.user_id, accessToken);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (chatId) {
        stopStreaming();
      }
    };
  }, [chatId, stopStreaming]);

  // Log WebSocket connection status
  useEffect(() => {
    if (wsConnected) {
      console.log("✅ WebSocket connected for real-time streaming");
    } else if (wsError) {
      console.error("❌ WebSocket connection error:", wsError);

      // Show user-friendly error for authentication issues
      if (wsError.includes("Authentication") || wsError.includes("403")) {
        console.warn(
          "💡 Tip: WebSocket requires authentication. Make sure you're logged in."
        );
      }
    }
  }, [wsConnected, wsError]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = message.trim();
      const newMessage = {
        id: messages.length + 1,
        type: "user",
        content: userMessage,
        timestamp: new Date(),
        model: selectedModel,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      setIsLoading(true);

      // Create placeholder for streaming AI response
      const aiMessageId = messages.length + 2;
      setStreamingMessageId(aiMessageId);

      const aiResponsePlaceholder = {
        id: aiMessageId,
        type: "ai",
        content: "",
        timestamp: new Date(),
        model: selectedModel,
        isStreaming: true,
      };
      setMessages((prev) => [...prev, aiResponsePlaceholder]);

      try {
        let currentChatId = chatId;

        // Check if this is the first user message (chat not initialized)
        if (!currentChatId) {
          console.log("Initializing new chat session...");
          // Initialize chat with the first message
          const aiResponseData = await initializeChat(userMessage);

          // Store the chat_id for subsequent messages
          if (aiResponseData?.success && aiResponseData.chat_id) {
            console.log("Chat initialized with ID:", aiResponseData.chat_id);
            currentChatId = aiResponseData.chat_id;
            setChatId(currentChatId);

            // Start WebSocket streaming for this chat
            startStreaming(currentChatId, {
              onMessage: (chunk) => {
                // Update the streaming message in real-time
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: msg.content + chunk }
                      : msg
                  )
                );
              },
              onComplete: (fullResponse) => {
                console.log("Stream complete, full response:", fullResponse);
                // Mark message as complete
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: fullResponse, isStreaming: false }
                      : msg
                  )
                );
                setIsLoading(false);
                setStreamingMessageId(null);
              },
              onError: (error) => {
                console.error("Streaming error:", error);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? {
                          ...msg,
                          content:
                            "Error receiving response. Please try again.",
                          isStreaming: false,
                        }
                      : msg
                  )
                );
                setIsLoading(false);
                setStreamingMessageId(null);
              },
            });
          } else {
            throw new Error("Failed to initialize chat: No chat_id received");
          }
        } else {
          console.log("Generating response for existing chat:", currentChatId);

          // Start WebSocket streaming before sending the message
          startStreaming(currentChatId, {
            onMessage: (chunk) => {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? { ...msg, content: msg.content + chunk }
                    : msg
                )
              );
            },
            onComplete: (fullResponse) => {
              console.log("Stream complete, full response:", fullResponse);
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? { ...msg, content: fullResponse, isStreaming: false }
                    : msg
                )
              );
              setIsLoading(false);
              setStreamingMessageId(null);
            },
            onError: (error) => {
              console.error("Streaming error:", error);
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? {
                        ...msg,
                        content: "Error receiving response. Please try again.",
                        isStreaming: false,
                      }
                    : msg
                )
              );
              setIsLoading(false);
              setStreamingMessageId(null);
            },
          });

          // Use existing chat_id for subsequent messages
          await ResponseGenerator(userMessage, currentChatId);
        }
      } catch (error) {
        console.error("Error sending message:", error);

        // Update the placeholder with error message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content:
                    error.message ||
                    "Sorry, I encountered an error while processing your message. Please try again.",
                  isStreaming: false,
                }
              : msg
          )
        );
        setIsLoading(false);
        setStreamingMessageId(null);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    {
      icon: <SupportAgent />,
      text: "Add Agent",
      color: "#8ab4f8",
      description:
        "Integrate smart AI agents to streamline operations and boost productivity",
    },
    {
      icon: <ModelTraining />,
      text: "Train Personalized Model",
      color: "#81c995",
      description:
        "Train domain-specific AI models optimized for your organization’s needs",
    },
    {
      icon: <SmartToy />,
      text: "Build Own Chatbot",
      color: "#fdd663",
      description:
        "Create a fully customized chatbot to engage users intelligently",
    },
    {
      icon: <AutoAwesome />,
      text: `Create Content with ${getCurrentModel()?.name || "AI"}`,
      color: "#f28b82",
      description: `Produce professional-grade content using ${
        getCurrentModel()?.name || "AI"
      } generative capabilities`,
    },
  ];

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0f1419",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {/* Welcome Section */}
      {messages.length === 1 && (
        <Box
          sx={{
            px: 4,
            pb: 8,
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Header with Model Selector */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 4,
              mt: 2,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 400,
                color: "#e8eaed",
                alignItems: "center",
              }}
            >
              Magure AI Studio
            </Typography>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={changeModel}
            />
          </Box>

          <Grid
            container
            spacing={2}
            sx={{ mb: 4, mt: 4, width: "100%", justifyContent: "center" }}
          >
            {quickPrompts.map((prompt, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor: "#1a1e23",
                    borderColor: "#3c4043",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                      backgroundColor: "#2d3748",
                    },
                  }}
                  onClick={() => setMessage(prompt.text)}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Box sx={{ color: prompt.color, mb: 1 }}>{prompt.icon}</Box>
                    <Typography variant="body2" sx={{ color: "#e8eaed" }}>
                      {prompt.text}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#808080" }}>
                      {prompt.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Messages */}
      {messages.length > 1 && (
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 4,
            py: 2,
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Model Selector for Chat View */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              pb: 2,
              borderBottom: "1px solid #3c4043",
            }}
          >
            <Typography variant="h6" sx={{ color: "#e8eaed", fontWeight: 500 }}>
              Chat Session
            </Typography>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={changeModel}
            />
          </Box>

          {messages.map((msg) => (
            <Box key={msg.id} sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent:
                    msg.type === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.type === "ai" && (
                  <Avatar
                    sx={{
                      bgcolor: msg.model?.includes("gemini")
                        ? "#4285f4"
                        : "#10a37f",
                      mr: 2,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {msg.model?.includes("gemini") ? (
                      <AutoAwesome fontSize="small" />
                    ) : (
                      <SmartToy fontSize="small" />
                    )}
                  </Avatar>
                )}
                <Box sx={{ maxWidth: "70%" }}>
                  {msg.type === "ai" && msg.model && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9aa0a6",
                        mb: 1,
                        display: "block",
                      }}
                    >
                      {msg.model.toUpperCase().replace("-", " ")}
                    </Typography>
                  )}
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor:
                        msg.type === "user" ? "#8ab4f8" : "#1a1e23",
                      color: msg.type === "user" ? "#0f1419" : "#e8eaed",
                      borderRadius:
                        msg.type === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      border: msg.type === "ai" ? "1px solid #3c4043" : "none",
                      position: "relative",
                    }}
                  >
                    <Typography variant="body1">
                      {msg.content || (msg.isStreaming ? "..." : "")}
                    </Typography>
                    {msg.isStreaming && (
                      <Box
                        sx={{
                          display: "inline-block",
                          ml: 1,
                          animation: "blink 1.4s infinite both",
                          "@keyframes blink": {
                            "0%, 80%, 100%": { opacity: 0 },
                            "40%": { opacity: 1 },
                          },
                        }}
                      >
                        ▋
                      </Box>
                    )}
                  </Paper>
                </Box>
                {msg.type === "user" && (
                  <Avatar
                    sx={{
                      bgcolor: "#81c995",
                      ml: 2,
                      width: 32,
                      height: 32,
                    }}
                  >
                    U
                  </Avatar>
                )}
              </Box>
            </Box>
          ))}
          {isLoading && <LoadingMessage />}
          <div ref={messagesEndRef} />
        </Box>
      )}

      {/* Input Area */}
      <Box
        sx={{
          p: 3,
          backgroundColor: "#0f1419",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ maxWidth: "1200px", width: "80%" }}>
          <Paper
            sx={{
              p: 1,
              display: "flex",
              alignItems: "flex-end",
              boxShadow: "none",
              borderRadius: 3,
              backgroundColor: "#0f1419",
              border: "1px solid #3c4043",
              "&:hover": {
                borderColor: "#5f6368",
              },
              "&:focus-within": {
                borderColor: "#8ab4f8",
              },
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              variant="outlined"
              placeholder={`Message ${selectedModel
                .toUpperCase()
                .replace("-", " ")}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                style: {
                  border: "none",
                  color: "#e8eaed",
                  backgroundColor: "transparent",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "& input": {
                    color: "#e8eaed",
                    "&::placeholder": {
                      color: "#9aa0a6",
                      opacity: 1,
                    },
                  },
                  "& textarea": {
                    color: "#e8eaed",
                    "&::placeholder": {
                      color: "#9aa0a6",
                      opacity: 1,
                    },
                  },
                  backgroundColor: "transparent",
                },
                "& .MuiInputBase-input": {
                  color: "#e8eaed",
                },
              }}
            />
            <Box sx={{ display: "flex", gap: 1, pb: 1 }}>
              <IconButton size="small" sx={{ color: "#9aa0a6" }}>
                <AttachFile />
              </IconButton>
              <IconButton
                size="small"
                color={isRecording ? "error" : "default"}
                onClick={() => setIsRecording(!isRecording)}
                sx={{ color: isRecording ? "#f28b82" : "#9aa0a6" }}
              >
                {isRecording ? <Stop /> : <Mic />}
              </IconButton>
              <IconButton
                size="small"
                color="primary"
                onClick={handleSendMessage}
                disabled={!message.trim()}
                sx={{ color: message.trim() ? "#8ab4f8" : "#5f6368" }}
              >
                <Send />
              </IconButton>
            </Box>
          </Paper>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#9aa0a6",
              }}
            >
              Magure AI can make mistakes. Consider checking important
              information.
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {chatId && (
                <Typography
                  variant="caption"
                  sx={{
                    color: wsConnected ? "#81c995" : "#f28b82",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: wsConnected ? "#81c995" : "#f28b82",
                      animation: wsConnected ? "pulse 2s infinite" : "none",
                      "@keyframes pulse": {
                        "0%, 100%": { opacity: 1 },
                        "50%": { opacity: 0.5 },
                      },
                    }}
                  />
                  {wsConnected ? "Live" : "Disconnected"}
                </Typography>
              )}
              <Typography
                variant="caption"
                sx={{
                  color: "#9aa0a6",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                Using: {selectedModel.toUpperCase().replace("-", " ")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;
