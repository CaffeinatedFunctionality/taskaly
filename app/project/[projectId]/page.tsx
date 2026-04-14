'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Paper,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import { ref, uploadBytes, getDownloadURL, StorageReference } from 'firebase/storage';
import { storage } from '@/lib/firebaseConfig';
import { useAuth } from '@/lib/authContext';
import {
  subscribeToProjects,
  subscribeToTasks,
  addTask,
  updateTask,
  deleteTask,
  subscribeToComments,
  addComment,
  subscribeToAttachments,
  addAttachment,
} from '@/lib/firestore';

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [taskLabels, setTaskLabels] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Subscribe to project
  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    const unsubscribeProjects = subscribeToProjects((projects) => {
      const projectData = projects.find((p) => p.id === projectId);
      setProject(projectData || null);
      if (!projectData) {
        // Project not found, maybe redirect?
        setLoading(false);
      }
    });
    return () => {
      unsubscribeProjects();
    };
  }, [projectId]);

  // Subscribe to tasks of this project
  useEffect(() => {
    if (!projectId) return;
    const unsubscribeTasks = subscribeToTasks(projectId, (tasksData) => {
      setTasks(tasksData);
    });
    return () => {
      unsubscribeTasks();
    };
  }, [projectId]);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center">
          Loading project...
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center">
          Project not found
        </Typography>
        <Button variant="outlined" href="/dashboard">
          Go back to dashboard
        </Button>
      </Container>
    );
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await addTask(projectId, {
        title: taskTitle,
        description: taskDescription,
        completed: false,
        dueDate: taskDueDate ? new Date(taskDueDate) : undefined,
        labels: taskLabels.split(',').map((label) => label.trim()).filter(Boolean),
        createdAt: new Date(),
      });
      setTaskTitle('');
      setTaskDescription('');
      setTaskDueDate('');
      setTaskLabels('');
      setOpenCreateTask(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenTaskDetail = (taskId: string) => {
    setSelectedTaskId(taskId);
    setOpenTaskDetail(true);
  };

  const handleCloseTaskDetail = () => {
    setOpenTaskDetail(false);
    setSelectedTaskId(null);
  };

  // Task detail modals state
  const [commentText, setCommentText] = useState<string>('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [comments, setComments] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [attachmentLoading, setAttachmentLoading] = useState(false);

  // Subscribe to comments and attachments for the selected task
  useEffect(() => {
    if (!selectedTaskId || !projectId) return;
    const unsubscribeComments = subscribeToComments(
      projectId,
      selectedTaskId,
      (commentsData) => {
        setComments(commentsData);
      }
    );
    const unsubscribeAttachments = subscribeToAttachments(
      projectId,
      selectedTaskId,
      (attachmentsData) => {
        setAttachments(attachmentsData);
      }
    );
    return () => {
      unsubscribeComments();
      unsubscribeAttachments();
    };
  }, [selectedTaskId, projectId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentLoading(true);
    try {
      if (!commentText.trim()) return;
      await addComment(projectId, selectedTaskId!, {
        text: commentText,
        createdAt: new Date(),
        createdBy: user?.uid ?? '',
      });
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentFile(file);
      setAttachmentName(file.name);
    }
  };

  const handleUploadAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttachmentLoading(true);
    try {
      if (!attachmentFile || !selectedTaskId || !projectId) return;
      const storageRef = ref(
        storage,
        `projects/${projectId}/tasks/${selectedTaskId}/attachments/${attachmentFile.name}`
      );
      await uploadBytes(storageRef, attachmentFile);
      const url = await getDownloadURL(storageRef);
      await addAttachment(projectId, selectedTaskId!, {
        url,
        name: attachmentName,
        uploadedAt: new Date(),
        uploadedBy: user?.uid ?? '',
      });
      setAttachmentFile(null);
      setAttachmentName('');
    } catch (error) {
      console.error('Failed to upload attachment:', error);
    } finally {
      setAttachmentLoading(false);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">{project.title}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" size="small" onClick={() => setOpenCreateTask(true)}>
            New Task
          </Button>
          <Button variant="outlined" size="small" href="/dashboard">
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      {tasks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2">No tasks yet. Create your first task!</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {tasks.map((task) => (
            <Paper
              key={task.id}
              sx={{ p: 3, width: 300, boxShadow: 2, cursor: 'pointer' }}
              onClick={() => handleOpenTaskDetail(task.id)}
            >
              <Typography variant="h6" component="h2">
                {task.title}
              </Typography>
              {task.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {task.description}
                </Typography>
              )}
              {task.dueDate && (
                <Typography variant="caption" color="text.disabled">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Typography>
              )}
              {task.labels && task.labels.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'gap', gap: 1 }}>
                  {task.labels.map((label: string) => (
                    <Box
                      key={label}
                      sx={{
                        bgcolor: 'action.hover',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                      }}
                    >
                      {label}
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {/* Create Task Dialog */}
      <Dialog open={openCreateTask} onClose={() => setOpenCreateTask(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{openCreateTask ? 'Create New Task' : 'Edit Task'}</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ width: '100%' }}>
            <form onSubmit={handleCreateTask}>
              <TextField
                label="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                sx={{ mb: 2 }}
                fullWidth
              />
              <TextField
                label="Description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
                multiline
                rows={4}
              />
              <TextField
                label="Due Date (YYYY-MM-DD)"
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
              />
              <TextField
                label="Labels (comma-separated)"
                value={taskLabels}
                onChange={(e) => setTaskLabels(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
              />
            </form>
          </Box>
        </DialogContent>
        <DialogActions sx={{ mt: 2 }}>
          <Button onClick={() => setOpenCreateTask(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateTask}
            disabled={submitLoading || !taskTitle.trim()}
          >
            {submitLoading ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Detail Dialog */}
      <Dialog open={openTaskDetail} onClose={handleCloseTaskDetail} maxWidth="lg" fullWidth>
        <DialogTitle>
          {selectedTaskId && tasks.find((t) => t.id === selectedTaskId)?.title}
        </DialogTitle>
        <DialogContent sx={{ mt: 2, display: 'flex', gap: 4 }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5">Task Details</Typography>
            <Box sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider' }}>
              <Typography variant="body1">
                <strong>Description:</strong>{' '}
                {tasks.find((t) => t.id === selectedTaskId)?.description ||
                  'No description'}
              </Typography>
              {tasks.find((t) => t.id === selectedTaskId)?.dueDate && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Due Date:</strong>{' '}
                    {new Date(
                      tasks.find((t) => t.id === selectedTaskId)?.dueDate
                    ).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
              {tasks.find((t) => t.id === selectedTaskId)?.labels &&
                tasks.find((t) => t.id === selectedTaskId)?.labels.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      <strong>Labels:</strong>{' '}
                      {tasks
                        .find((t) => t.id === selectedTaskId)
                        ?.labels.join(', ')}
                    </Typography>
                  </Box>
                )}
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5">Comments</Typography>
              <Box
                sx={{
                  flex: 1,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  pb: 2,
                  overflowY: 'auto',
                  maxHeight: 300,
                }}
              >
                {comments.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No comments yet
                  </Typography>
                ) : (
                  <Box sx={{ mb: 2 }}>
                    {comments.map((comment) => (
                      <Box key={comment.id} sx={{ mb: 1, p: 1, border: 1, borderColor: 'divider' }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          {comment.text}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {new Date(comment.createdAt).toLocaleString()} by{' '}
                          {comment.createdBy}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <Box sx={{ mt: 2 }}>
                <form onSubmit={handleAddComment}>
                  <TextField
                    label="Add a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    sx={{ mb: 2 }}
                    fullWidth
                    multiline
                    rows={2}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={commentLoading || !commentText.trim()}
                  >
                    {commentLoading ? 'Adding...' : 'Add Comment'}
                  </Button>
                </form>
              </Box>
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: 4 }}>
            <Typography variant="h5">Attachments</Typography>
            <Box
              sx={{
                flex: 1,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                pb: 2,
                overflowY: 'auto',
                maxHeight: 300,
              }}
            >
              {attachments.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No attachments yet
                </Typography>
              ) : (
                <Box sx={{ mb: 2 }}>
                  {attachments.map((attachment) => (
                    <Box
                      key={attachment.id}
                      sx={{ mb: 1, p: 1, display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider' }}
                    >
                      <Typography variant="body2" sx={{ flex: 1, mb: 0 }}>
                        {attachment.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1 }}><a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          🔗
                        </a></Box>
                        <Typography variant="caption" color="text.disabled" sx={{ ml: 1 }}>
                          {new Date(attachment.uploadedAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <Box sx={{ mt: 2 }}>
              <form onSubmit={handleUploadAttachment}>
                <TextField
                  label="Attachment name"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  sx={{ mb: 2 }}
                  fullWidth
                  disabled={!!attachmentFile}
                />
                <input
                  type="file"
                  accept="*/*"
                  onChange={handleAttachmentChange}
                  style={{ display: 'none' }}
                  id="attachment-upload"
                />
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ mb: 2 }}
                  htmlFor="attachment-upload"
                >
                  Choose File
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={attachmentLoading || !attachmentFile}
                >
                  {attachmentLoading ? 'Uploading...' : 'Upload Attachment'}
                </Button>
              </form>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ mt: 2 }}>
          <Button onClick={handleCloseTaskDetail}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}