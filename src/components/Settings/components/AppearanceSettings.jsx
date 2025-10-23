import React from "react";
import { Box, Switch, Typography } from "@mui/material";
import { Card, SettingsSection } from "../../common";

const AppearanceSettings = ({ settings, onUpdateSetting }) => {
  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <SettingsSection title="Appearance" />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="body1">Dark Mode</Typography>
            <Typography variant="body2" color="text.secondary">
              Use dark theme across the application
            </Typography>
          </Box>
          <Switch
            checked={settings.darkMode}
            onChange={(e) => onUpdateSetting("darkMode", e.target.checked)}
            color="primary"
          />
        </Box>
      </Box>
    </Card>
  );
};

export default AppearanceSettings;
