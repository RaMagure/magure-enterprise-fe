// Navigation routes
export const ROUTES = {
  HOME: "/",
  CHAT: "/chat",
  SETTINGS: "/settings",
  HELP: "/help",
};

// Drawer configuration
export const DRAWER_WIDTH = 280;

// Theme colors
export const COLORS = {
  primary: "#8ab4f8",
  secondary: "#81c995",
  background: {
    default: "#0f1419",
    paper: "#1a1e23",
  },
  text: {
    primary: "#e8eaed",
    secondary: "#9aa0a6",
  },
  divider: "#3c4043",
  hover: "#2d3748",
};

// Settings sections configuration
export const SETTINGS_SECTIONS = [
  {
    id: "profile",
    title: "Profile",
    description: "Manage your personal information",
  },
  {
    id: "security",
    title: "Security",
    description: "Password and authentication settings",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Control your notification preferences",
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Customize the look and feel",
  },
  {
    id: "language",
    title: "Language & Region",
    description: "Set your language and regional preferences",
  },
  {
    id: "storage",
    title: "Data & Storage",
    description: "Manage your data and storage usage",
  },
  {
    id: "help",
    title: "Help & Support",
    description: "Get help and contact support",
  },
];

// Supported languages
export const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Español" },
  { value: "French", label: "Français" },
  { value: "German", label: "Deutsch" },
  { value: "Japanese", label: "日本語" },
];
