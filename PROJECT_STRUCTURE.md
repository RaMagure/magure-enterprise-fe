# Project Structure

This document outlines the improved codebase structure for better maintainability and reusability.

## 📁 Directory Structure

```
src/
├── components/                    # React components
│   ├── common/                   # Reusable components
│   │   ├── Button/
│   │   │   └── Button.jsx       # Custom button component
│   │   ├── Card/
│   │   │   └── Card.jsx         # Custom card component
│   │   ├── NavigationItem/
│   │   │   └── NavigationItem.jsx # Navigation item component
│   │   ├── PageHeader/
│   │   │   └── PageHeader.jsx   # Page header component
│   │   ├── SettingsSection/
│   │   │   └── SettingsSection.jsx # Settings section wrapper
│   │   └── index.js             # Common components exports
│   │
│   ├── Chat/                    # Chat related components
│   │   ├── ChatInterface.jsx
│   │   ├── HistoryDialog.jsx
│   │   └── LoadingMessage.jsx
│   │
│   ├── Layout/                  # Layout components
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   │
│   └── Settings/                # Settings page components
│       ├── SettingsPage.jsx     # Main settings page
│       ├── SettingsNavigation.jsx # Settings sidebar navigation
│       └── components/          # Settings specific components
│           ├── ProfileSettings.jsx
│           ├── AppearanceSettings.jsx
│           ├── NotificationSettings.jsx
│           ├── LanguageSettings.jsx
│           ├── DataStorageSettings.jsx
│           └── index.js
│
├── hooks/                       # Custom React hooks
│   ├── useSettings.js          # Settings management hook
│   ├── useProfile.js           # Profile management hook
│   └── index.js
│
├── theme/                       # Theme configuration
│   └── index.js                # Material-UI theme setup
│
├── utils/                       # Utility functions and constants
│   └── constants.js            # App constants and configuration
│
├── assets/                      # Static assets
│   └── images/
│
├── App.jsx                      # Main application component
├── main.jsx                     # Application entry point
└── index.css                    # Global styles
```

## 🧩 Component Organization

### Common Components (`/components/common/`)

Reusable UI components that can be used throughout the application:

- **Button**: Standardized button with consistent styling
- **Card**: Custom card component with app-specific styling
- **NavigationItem**: Reusable navigation list item
- **PageHeader**: Consistent page header layout
- **SettingsSection**: Wrapper for settings sections

### Feature-Specific Components

Components organized by feature for better maintainability:

- **Chat**: All chat-related functionality
- **Layout**: Application layout components
- **Settings**: Settings page and its sub-components

## 🎣 Custom Hooks (`/hooks/`)

### useSettings

Manages application settings with localStorage persistence:

```javascript
const { settings, updateSetting, resetSettings } = useSettings();
```

### useProfile

Manages user profile data and editing state:

```javascript
const {
  profileData,
  isEditing,
  updateProfile,
  saveProfile,
  startEdit,
  cancelEdit,
} = useProfile();
```

## 🎨 Theme Configuration (`/theme/`)

Centralized Material-UI theme configuration for consistent styling across the application.

## 🔧 Utilities (`/utils/`)

### Constants

- **ROUTES**: Application route definitions
- **DRAWER_WIDTH**: Sidebar width constant
- **COLORS**: App color palette
- **SETTINGS_SECTIONS**: Settings navigation configuration
- **LANGUAGES**: Supported languages list

## 📦 Benefits of This Structure

### 1. **Reusability**

- Common components can be used across different features
- Consistent styling and behavior

### 2. **Maintainability**

- Clear separation of concerns
- Easy to locate and modify specific functionality
- Modular component structure

### 3. **Scalability**

- Easy to add new features without affecting existing code
- Clear patterns for new developers to follow

### 4. **Performance**

- Smaller bundle sizes through modular imports
- Easy to implement code splitting

### 5. **Developer Experience**

- Clear file organization
- Consistent naming conventions
- Easy to understand component relationships

## 🚀 Usage Examples

### Importing Common Components

```javascript
import { Card, Button, NavigationItem } from "../common";
```

### Using Custom Hooks

```javascript
import { useSettings, useProfile } from "../../hooks";

const MyComponent = () => {
  const { settings, updateSetting } = useSettings();
  const { profileData, startEdit } = useProfile();

  // Component logic here
};
```

### Using Constants

```javascript
import { ROUTES, COLORS } from '../../utils/constants';

// Navigate to settings
navigate(ROUTES.SETTINGS);

// Use app colors
sx={{ color: COLORS.primary }}
```

## 📝 Best Practices

1. **Component Naming**: Use PascalCase for component files and folders
2. **Export Pattern**: Use named exports for utilities, default exports for components
3. **Props Interface**: Keep props interfaces simple and well-documented
4. **File Organization**: Group related files in folders with index.js exports
5. **Import Order**: Group imports by source (React, external libraries, internal)

This structure provides a solid foundation for scaling the application while maintaining code quality and developer productivity.
