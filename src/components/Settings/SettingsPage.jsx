import React, { useState } from "react";
import { Box } from "@mui/material";
import { PageHeader } from "../common";
import { useSettings, useProfile } from "../../hooks";
import SettingsNavigation from "./SettingsNavigation";
import {
  ProfileSettings,
  AppearanceSettings,
  NotificationSettings,
  LanguageSettings,
  DataStorageSettings,
} from "./components";

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const { settings, updateSetting } = useSettings();
  const {
    profileData,
    isEditing,
    updateProfile,
    saveProfile,
    cancelEdit,
    startEdit,
  } = useProfile();

  const renderSettingsContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <ProfileSettings
            profileData={profileData}
            isEditing={isEditing}
            onEdit={startEdit}
            onSave={saveProfile}
            onCancel={cancelEdit}
            onUpdate={updateProfile}
          />
        );
      case "appearance":
        return (
          <AppearanceSettings
            settings={settings}
            onUpdateSetting={updateSetting}
          />
        );
      case "notifications":
        return (
          <NotificationSettings
            settings={settings}
            onUpdateSetting={updateSetting}
          />
        );
      case "language":
        return (
          <LanguageSettings
            settings={settings}
            onUpdateSetting={updateSetting}
          />
        );
      case "storage":
        return <DataStorageSettings />;
      default:
        return (
          <ProfileSettings
            profileData={profileData}
            isEditing={isEditing}
            onEdit={startEdit}
            onSave={saveProfile}
            onCancel={cancelEdit}
            onUpdate={updateProfile}
          />
        );
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <PageHeader
        title="Settings"
        subtitle="Manage your account settings and preferences"
      />

      <Box sx={{ display: "flex", gap: 3 }}>
        <SettingsNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <Box sx={{ flexGrow: 1 }}>{renderSettingsContent()}</Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
