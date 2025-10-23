import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Drawer, List, Divider, Box, Typography, Chip } from "@mui/material";
import {
  ChatBubbleOutline,
  History,
  Settings,
  Help,
  Add,
  Code,
  Image,
  VideoLibrary,
} from "@mui/icons-material";
import { NavigationItem } from "../common";
import { DRAWER_WIDTH, ROUTES } from "../../utils/constants";
import HistoryDialog from "../Chat/HistoryDialog";

const Sidebar = () => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const mainItems = [
    {
      text: "New Chat",
      icon: <Add />,
      primary: true,
      action: () => navigate(ROUTES.CHAT),
    },
  ];

  const chatItems = [
    {
      text: "Chat with AI",
      icon: <ChatBubbleOutline />,
      action: () => navigate(ROUTES.CHAT),
    },
    {
      text: "Code Assistant",
      icon: <Code />,
      action: () => navigate(ROUTES.CHAT),
    },
    {
      text: "Image Generator",
      icon: <Image />,
      action: () => navigate(ROUTES.CHAT),
    },
    {
      text: "Video Analysis",
      icon: <VideoLibrary />,
      action: () => navigate(ROUTES.CHAT),
    },
  ];

  const recentChats = [
    "Marketing Strategy Discussion",
    "Code Review for Project X",
    "Data Analysis Questions",
    "Product Launch Planning",
    "Budget Optimization",
  ];

  const bottomItems = [
    { text: "History", icon: <History />, action: () => setHistoryOpen(true) },
    {
      text: "Settings",
      icon: <Settings />,
      action: () => navigate(ROUTES.SETTINGS),
    },
    { text: "Help & Support", icon: <Help /> },
  ];

  return (
    <Drawer
      variant="persistent"
      open={true}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          top: "64px",
          height: "calc(100vh - 64px)",
          borderRight: "1px solid #3c4043",
          backgroundColor: "#1a1e23",
          transition: "transform 0.3s ease-in-out",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* New Chat Button */}
        {mainItems.map((item) => (
          <NavigationItem
            key={item.text}
            text={item.text}
            icon={item.icon}
            onClick={item.action}
            primary={item.primary}
            sx={{ mb: 2 }}
          />
        ))}

        {/* AI Features */}
        <Typography
          variant="body2"
          sx={{ color: "#9aa0a6", mb: 1, fontWeight: 500 }}
        >
          AI Features
        </Typography>
        <List sx={{ py: 0 }}>
          {chatItems.map((item) => (
            <NavigationItem
              key={item.text}
              text={item.text}
              icon={item.icon}
              onClick={item.action}
              isActive={
                location.pathname === ROUTES.CHAT &&
                item.text === "Chat with AI"
              }
            />
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Recent Chats */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography
            variant="body2"
            sx={{ color: "#9aa0a6", fontWeight: 500, flexGrow: 1 }}
          >
            Recent
          </Typography>
          <Chip
            label="Pro"
            size="small"
            sx={{
              backgroundColor: "#81c995",
              color: "#0f1419",
              fontSize: "10px",
              height: "20px",
            }}
          />
        </Box>
        <List sx={{ py: 0 }}>
          {recentChats.map((chat, index) => (
            <NavigationItem
              key={index}
              text={chat}
              icon={<ChatBubbleOutline fontSize="small" />}
              onClick={() => navigate(ROUTES.CHAT)}
            />
          ))}
        </List>
      </Box>

      {/* Bottom Items */}
      <Box sx={{ mt: "auto", p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <List sx={{ py: 0 }}>
          {bottomItems.map((item) => (
            <NavigationItem
              key={item.text}
              text={item.text}
              icon={item.icon}
              onClick={item.action}
              isActive={
                location.pathname === ROUTES.SETTINGS &&
                item.text === "Settings"
              }
            />
          ))}
        </List>
      </Box>

      <HistoryDialog open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </Drawer>
  );
};

export default Sidebar;
