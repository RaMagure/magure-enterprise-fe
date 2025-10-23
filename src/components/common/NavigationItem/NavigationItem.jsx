import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const NavigationItem = ({
  text,
  icon,
  onClick,
  isActive = false,
  primary = false,
  sx = {},
  ...props
}) => {
  const getButtonStyles = () => {
    if (primary) {
      return {
        backgroundColor: "#8ab4f8",
        color: "#0f1419",
        "&:hover": {
          backgroundColor: "#669df6",
        },
      };
    }

    return {
      backgroundColor: isActive ? "#2d3748" : "transparent",
      "&:hover": {
        backgroundColor: "#2d3748",
      },
    };
  };

  return (
    <ListItem disablePadding {...props}>
      <ListItemButton
        onClick={onClick}
        sx={{
          borderRadius: "8px",
          my: 0.5,
          ...getButtonStyles(),
          ...sx,
        }}
      >
        <ListItemIcon
          sx={{
            color: primary ? "#0f1419" : "#9aa0a6",
            minWidth: "40px",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{
            fontSize: primary ? "14px" : "13px",
            color: primary ? "#0f1419" : "#e8eaed",
            fontWeight: primary ? 500 : 400,
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default NavigationItem;
