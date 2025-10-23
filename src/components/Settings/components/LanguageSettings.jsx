import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Card, SettingsSection } from "../../common";
import { LANGUAGES } from "../../../utils/constants";

const LanguageSettings = ({ settings, onUpdateSetting }) => {
  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <SettingsSection title="Language & Region" />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={settings.language}
            onChange={(e) => onUpdateSetting("language", e.target.value)}
            label="Language"
          >
            {LANGUAGES.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Card>
  );
};

export default LanguageSettings;
