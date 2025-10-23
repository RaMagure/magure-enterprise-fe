import React from "react";
import { Box, Typography } from "@mui/material";

const PageHeader = ({ title, subtitle, children, sx = {} }) => {
  return (
    <Box sx={{ mb: 4, ...sx }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default PageHeader;
