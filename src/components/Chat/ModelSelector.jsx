import React from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";
import { SmartToy, AutoAwesome } from "@mui/icons-material";

const ModelSelector = ({ selectedModel, onModelChange, sx = {} }) => {
  const models = [
    {
      id: "gpt-4",
      name: "GPT-4",
      provider: "OpenAI",
      description: "Most capable model, best for complex tasks",
      icon: <SmartToy />,
      color: "#10a37f",
      badge: "Premium",
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      provider: "OpenAI",
      description: "Fast and efficient for most tasks",
      icon: <SmartToy />,
      color: "#10a37f",
      badge: "Standard",
    },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      provider: "Google",
      description: "Advanced reasoning and multimodal capabilities",
      icon: <AutoAwesome />,
      color: "#4285f4",
      badge: "Premium",
    },
    {
      id: "gemini-flash",
      name: "Gemini Flash",
      provider: "Google",
      description: "Fast responses with good quality",
      icon: <AutoAwesome />,
      color: "#4285f4",
      badge: "Standard",
    },
  ];

  const selectedModelData = models.find((model) => model.id === selectedModel);

  return (
    <Box sx={{ minWidth: 200, ...sx }}>
      <FormControl fullWidth size="small">
        <Select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          displayEmpty
          sx={{
            backgroundColor: "#1a1e23",
            border: "1px solid #3c4043",
            borderRadius: "8px",
            color: "#e8eaed",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiSelect-icon": {
              color: "#9aa0a6",
            },
            "&:hover": {
              borderColor: "#5f6368",
            },
            "&.Mui-focused": {
              borderColor: "#8ab4f8",
            },
          }}
          renderValue={(value) => {
            if (!value || !selectedModelData) {
              return (
                <Typography variant="body2" sx={{ color: "#9aa0a6" }}>
                  Select Model
                </Typography>
              );
            }
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: selectedModelData.color,
                  }}
                >
                  {React.cloneElement(selectedModelData.icon, {
                    fontSize: "small",
                  })}
                </Avatar>
                <Typography variant="body2" sx={{ color: "#e8eaed" }}>
                  {selectedModelData.name}
                </Typography>
                <Chip
                  label={selectedModelData.badge}
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: "10px",
                    backgroundColor:
                      selectedModelData.badge === "Premium"
                        ? "#fdd663"
                        : "#81c995",
                    color: "#0f1419",
                  }}
                />
              </Box>
            );
          }}
        >
          {models.map((model) => (
            <MenuItem
              key={model.id}
              value={model.id}
              sx={{
                backgroundColor: "#1a1e23",
                color: "#e8eaed",
                "&:hover": {
                  backgroundColor: "#2d3748",
                },
                "&.Mui-selected": {
                  backgroundColor: "#2d3748",
                  "&:hover": {
                    backgroundColor: "#2d3748",
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: model.color,
                  }}
                >
                  {React.cloneElement(model.icon, { fontSize: "small" })}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {model.name}
                    </Typography>
                    <Chip
                      label={model.badge}
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: "10px",
                        backgroundColor:
                          model.badge === "Premium" ? "#fdd663" : "#81c995",
                        color: "#0f1419",
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: "#9aa0a6" }}>
                    {model.provider} • {model.description}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ModelSelector;
