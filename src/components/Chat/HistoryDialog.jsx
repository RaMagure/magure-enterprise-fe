import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  Typography,
  Box
} from '@mui/material';
import { 
  History, 
  Delete, 
  Search,
  ChatBubbleOutline 
} from '@mui/icons-material';

const HistoryDialog = ({ open, onClose }) => {
  const [chatHistory] = useState([
    {
      id: 1,
      title: 'Marketing Strategy Discussion',
      date: '2 days ago',
      preview: 'Let\'s discuss the Q4 marketing strategy for our new product launch...'
    },
    {
      id: 2,
      title: 'Code Review for Project X',
      date: '1 week ago',
      preview: 'Can you help me review this React component for performance issues?'
    },
    {
      id: 3,
      title: 'Data Analysis Questions',
      date: '2 weeks ago',
      preview: 'I need help analyzing this sales data to identify trends...'
    },
    {
      id: 4,
      title: 'Product Launch Planning',
      date: '3 weeks ago',
      preview: 'What are the key considerations for launching our new SaaS product?'
    },
    {
      id: 5,
      title: 'Budget Optimization',
      date: '1 month ago',
      preview: 'How can we optimize our department budget for the next quarter?'
    }
  ]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center',
        borderBottom: '1px solid #3c4043',
        backgroundColor: '#1a1e23',
        color: '#e8eaed'
      }}>
        <History sx={{ mr: 1, color: '#8ab4f8' }} />
        Chat History
      </DialogTitle>
      <DialogContent sx={{ p: 0, backgroundColor: '#1a1e23' }}>
        {chatHistory.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <ChatBubbleOutline sx={{ fontSize: 48, color: '#3c4043', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#9aa0a6', mb: 1 }}>
              No chat history yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#5f6368' }}>
              Your conversations with Magure AI will appear here
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {chatHistory.map((chat, index) => (
              <React.Fragment key={chat.id}>
                <ListItem 
                  button 
                  sx={{ 
                    py: 2,
                    '&:hover': {
                      backgroundColor: '#2d3748'
                    }
                  }}
                >
                  <ListItemIcon>
                    <ChatBubbleOutline sx={{ color: '#9aa0a6' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#e8eaed' }}>
                        {chat.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: '#9aa0a6', mb: 0.5 }}>
                          {chat.date}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#5f6368' }}>
                          {chat.preview}
                        </Typography>
                      </Box>
                    }
                  />
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    sx={{ ml: 2 }}
                  >
                    Delete
                  </Button>
                </ListItem>
                {index < chatHistory.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #3c4043', p: 2, backgroundColor: '#1a1e23' }}>
        <Button onClick={onClose} sx={{ color: '#9aa0a6' }}>Close</Button>
        <Button variant="contained" startIcon={<Search />} sx={{ backgroundColor: '#8ab4f8', color: '#0f1419' }}>
          Search History
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoryDialog;