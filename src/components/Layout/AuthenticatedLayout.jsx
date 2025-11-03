import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AuthenticatedLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginTop: "64px",
          height: "calc(100vh - 64px)",
          overflow: "auto",
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuthenticatedLayout;
