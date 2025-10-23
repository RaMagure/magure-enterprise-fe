import { useState } from "react";

// Custom hook for managing user profile
export const useProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@magure.com",
    role: "Enterprise User",
    avatar: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  const updateProfile = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveProfile = async () => {
    try {
      // Here you would typically make an API call to save the profile
      console.log("Saving profile:", profileData);
      setIsEditing(false);
      return { success: true };
    } catch (error) {
      console.error("Error saving profile:", error);
      return { success: false, error };
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  const startEdit = () => {
    setIsEditing(true);
  };

  return {
    profileData,
    isEditing,
    updateProfile,
    saveProfile,
    cancelEdit,
    startEdit,
  };
};
