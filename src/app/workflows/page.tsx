'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { subscribeToWorkflows, addWorkflow } from '@/lib/workflows';
import { Timestamp } from 'firebase/firestore';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  // Subscribe to workflows in real-time
  useEffect(() => {
    const unsubscribe = subscribeToWorkflows((workflowList) => {
      setWorkflows(workflowList);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      await addWorkflow({
        title: title.trim(),
        description: description.trim(),
        trigger: { type: 'none' }, // placeholder
        actions: [], // placeholder
        isActive: false,
        createdAt: Timestamp.now(),
      });
      setTitle('');
      setDescription('');
      setOpenCreateDialog(false);
    } catch (error) {
      console.error('Error creating workflow:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Workflows
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreateDialog(true)}
          sx={{ mb: 2 }}
        >
          Create Workflow
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : workflows.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No workflows yet. Create one to get started.
        </Typography>
      ) : (
        <List>
          {workflows.map((wf) => (
            <ListItem
              key={wf.id}
              sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}
              onClick={() => {
                // Navigate to workflow detail page (we'll implement later)
                console.log('Click workflow:', wf.id);
              }}
            >
              <ListItemText
                primary={wf.title}
                secondary={wf.description}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Create Workflow Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Workflow</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Give your workflow a name and description.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}