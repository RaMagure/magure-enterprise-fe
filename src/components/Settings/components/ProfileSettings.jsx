import React from "react";
import { Box, Avatar, TextField, Chip, IconButton } from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";
import { Card, Button, SettingsSection } from "../../common";

const ProfileSettings = ({
  profileData,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onUpdate,
}) => {
  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <SettingsSection title="Profile Information" />
          <IconButton onClick={isEditing ? onCancel : onEdit} color="primary">
            {isEditing ? <Cancel /> : <Edit />}
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{ width: 80, height: 80, mr: 3, bgcolor: "primary.main" }}
          >
            {profileData.name.charAt(0)}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            {isEditing ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Name"
                  value={profileData.name}
                  onChange={(e) => onUpdate("name", e.target.value)}
                  size="small"
                />
                <TextField
                  label="Email"
                  value={profileData.email}
                  onChange={(e) => onUpdate("email", e.target.value)}
                  size="small"
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={onSave}
                    size="small"
                  >
                    Save
                  </Button>
                  <Button variant="outlined" onClick={onCancel} size="small">
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 1 }}>
                  <Box
                    component="span"
                    sx={{ fontSize: "1.25rem", fontWeight: 600 }}
                  >
                    {profileData.name}
                  </Box>
                </Box>
                <Box sx={{ mb: 2, color: "text.secondary" }}>
                  {profileData.email}
                </Box>
                <Chip label={profileData.role} size="small" color="primary" />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default ProfileSettings;
