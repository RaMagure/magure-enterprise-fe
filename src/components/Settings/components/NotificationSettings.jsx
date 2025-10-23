import React from "react";
import { Box, Switch, Typography } from "@mui/material";
import { Card, SettingsSection } from "../../common";

const NotificationSettings = ({ settings, onUpdateSetting }) => {
  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <SettingsSection title="Notifications" />

        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="body1">Push Notifications</Typography>
              <Typography variant="body2" color="text.secondary">
                Receive notifications about your chats and updates
              </Typography>
            </Box>
            <Switch
              checked={settings.notifications}
              onChange={(e) =>
                onUpdateSetting("notifications", e.target.checked)
              }
              color="primary"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="body1">Auto-save Conversations</Typography>
              <Typography variant="body2" color="text.secondary">
                Automatically save your chat conversations
              </Typography>
            </Box>
            <Switch
              checked={settings.autoSave}
              onChange={(e) => onUpdateSetting("autoSave", e.target.checked)}
              color="primary"
            />
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default NotificationSettings;
