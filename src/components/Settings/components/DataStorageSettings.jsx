import React from "react";
import { Box, Typography } from "@mui/material";
import { Card, SettingsSection, Button } from "../../common";

const DataStorageSettings = () => {
  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <SettingsSection title="Data & Storage" />

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Storage Usage
          </Typography>
          <Typography variant="body2" color="text.secondary">
            2.1 GB of 10 GB used
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 8,
              backgroundColor: "action.hover",
              borderRadius: 4,
              mt: 1,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "21%",
                height: "100%",
                backgroundColor: "primary.main",
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" color="error">
            Clear Chat History
          </Button>
          <Button variant="outlined">Export Data</Button>
        </Box>
      </Box>
    </Card>
  );
};

export default DataStorageSettings;
