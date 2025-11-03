import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "background.default",
        gap: 3,
      }}
    >
      <CircularProgress size={60} color="primary" />
      <Typography variant="h6" color="text.primary">
        Checking authentication...
      </Typography>
    </Box>
  );
};

export default LoadingPage;
