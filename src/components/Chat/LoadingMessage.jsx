import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';

const LoadingMessage = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-start',
      mb: 3
    }}>
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#8ab4f8',
        borderRadius: '50%',
        width: 32,
        height: 32,
        mr: 2,
        justifyContent: 'center'
      }}>
        <AutoAwesome sx={{ color: '#0f1419', fontSize: 16 }} />
      </Box>
      <Box sx={{ 
        bgcolor: '#1a1e23',
        border: '1px solid #3c4043',
        borderRadius: '18px',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <CircularProgress size={16} sx={{ color: '#8ab4f8' }} />
        <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
          Magure AI is thinking...
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingMessage;