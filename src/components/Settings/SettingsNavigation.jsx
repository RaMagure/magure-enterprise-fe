import React from "react";
import { List, Typography, Divider } from "@mui/material";
import {
  Person,
  Security,
  Notifications,
  Language,
  Palette,
  Storage,
  Help,
  Logout,
} from "@mui/icons-material";
import { Card, NavigationItem } from "../common";
import { SETTINGS_SECTIONS } from "../../utils/constants";

const SettingsNavigation = ({ activeSection, onSectionChange }) => {
  const sectionIcons = {
    profile: <Person />,
    security: <Security />,
    notifications: <Notifications />,
    appearance: <Palette />,
    language: <Language />,
    storage: <Storage />,
    help: <Help />,
  };

  return (
    <Card sx={{ width: 280, height: "fit-content" }}>
      <Typography variant="h6" sx={{ p: 2, fontWeight: 600 }}>
        Settings
      </Typography>

      <List sx={{ py: 0, px: 1 }}>
        {SETTINGS_SECTIONS.map((section) => (
          <NavigationItem
            key={section.id}
            text={section.title}
            icon={sectionIcons[section.id]}
            onClick={() => onSectionChange(section.id)}
            isActive={activeSection === section.id}
          />
        ))}

        <Divider sx={{ my: 2 }} />

        <NavigationItem
          text="Sign Out"
          icon={<Logout />}
          onClick={() => console.log("Sign out")}
          sx={{ color: "error.main" }}
        />
      </List>
    </Card>
  );
};

export default SettingsNavigation;
