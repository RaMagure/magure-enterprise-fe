import React from "react";
import { Button as MuiButton } from "@mui/material";

const Button = ({
  children,
  variant = "contained",
  color = "primary",
  size = "medium",
  sx = {},
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      sx={{
        textTransform: "none",
        borderRadius: "8px",
        fontWeight: 500,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
