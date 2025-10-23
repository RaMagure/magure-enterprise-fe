import { useState, useEffect } from "react";

// Custom hook for managing user settings
export const useSettings = () => {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    language: "English",
    autoSave: true,
  });

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings({
      darkMode: true,
      notifications: true,
      language: "English",
      autoSave: true,
    });
  };

  // Persist settings to localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("magure-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("magure-settings", JSON.stringify(settings));
  }, [settings]);

  return {
    settings,
    updateSetting,
    resetSettings,
  };
};
