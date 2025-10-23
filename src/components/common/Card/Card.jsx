import React from "react";
import { Card as MuiCard } from "@mui/material";

const Card = ({ children, elevation = 1, sx = {}, ...props }) => {
  return (
    <MuiCard
      elevation={elevation}
      sx={{
        borderRadius: "12px",
        background: "#1a1e23",
        border: "1px solid #3c4043",
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiCard>
  );
};

export default Card;
