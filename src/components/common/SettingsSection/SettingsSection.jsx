import React from "react";
import { Box, Typography } from "@mui/material";

const SettingsSection = ({ title, subtitle, children, sx = {} }) => {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: subtitle ? 1 : 3 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default SettingsSection;
