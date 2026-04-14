import { db } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  DocumentData,
  where,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

export const projectsCollection = collection(db, 'projects');

export const subscribeToProjects = (callback: (projects: any[]) => void) => {
  const q = query(projectsCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const projects: any[] = [];
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    callback(projects);
  });
};

export const addProject = async (projectData: { 
  title: string; 
  description: string; 
  dueDate?: any; // Firestore timestamp or ISO string
  labels?: string[];
  createdAt: any;
}) => {
  try {
    const docRef = await addDoc(projectsCollection, {
      ...projectData,
      dueDate: projectData.dueDate || null,
      labels: projectData.labels || [],
      createdAt: projectData.createdAt || new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding project: ', error);
    throw error;
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    console.error('Error deleting project: ', error);
    throw error;
  }
};

export const updateProject = async (projectId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'projects', projectId), data);
  } catch (error) {
    console.error('Error updating project: ', error);
    throw error;
  }
};

// Tasks functions
export const tasksCollection = (projectId: string) => 
  collection(db, 'projects', projectId, 'tasks');

export const subscribeToTasks = (projectId: string, callback: (tasks: any[]) => void) => {
  if (!projectId) return () => {};
  const q = query(tasksCollection(projectId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const tasks: any[] = [];
    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    callback(tasks);
  });
};

export const addTask = async (projectId: string, taskData: { 
  title: string; 
  description: string; 
  completed: boolean;
  dueDate?: any; // Firestore timestamp or ISO string
  labels?: string[];
  createdAt: any;
}) => {
  try {
    const docRef = await addDoc(tasksCollection(projectId), {
      ...taskData,
      dueDate: taskData.dueDate || null,
      labels: taskData.labels || [],
      createdAt: taskData.createdAt || new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding task: ', error);
    throw error;
  }
};

export const updateTask = async (projectId: string, taskId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'projects', projectId, 'tasks', taskId), data);
  } catch (error) {
    console.error('Error updating task: ', error);
    throw error;
  }
};

export const deleteTask = async (projectId: string, taskId: string) => {
  try {
    await deleteDoc(doc(db, 'projects', projectId, 'tasks', taskId));
  } catch (error) {
    console.error('Error deleting task: ', error);
    throw error;
  }
};

// Comments functions
export const commentsCollection = (projectId: string, taskId: string) =>
  collection(db, 'projects', projectId, 'tasks', taskId, 'comments');

export const subscribeToComments = (projectId: string, taskId: string, callback: (comments: any[]) => void) => {
  if (!projectId || !taskId) return () => {};
  const q = query(commentsCollection(projectId, taskId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const comments: any[] = [];
    snapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    callback(comments);
  });
};

export const addComment = async (projectId: string, taskId: string, commentData: {
  text: string;
  createdAt: any;
  createdBy: string; // uid
}) => {
  try {
    const docRef = await addDoc(commentsCollection(projectId, taskId), {
      ...commentData,
      createdAt: commentData.createdAt || new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Attachments functions
export const attachmentsCollection = (projectId: string, taskId: string) =>
  collection(db, 'projects', projectId, 'tasks', taskId, 'attachments');

export const subscribeToAttachments = (projectId: string, taskId: string, callback: (attachments: any[]) => void) => {
  if (!projectId || !taskId) return () => {};
  const q = query(attachmentsCollection(projectId, taskId), orderBy('uploadedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const attachments: any[] = [];
    snapshot.forEach((doc) => {
      attachments.push({ id: doc.id, ...doc.data() });
    });
    callback(attachments);
  });
};

export const addAttachment = async (projectId: string, taskId: string, attachmentData: {
  url: string;
  name: string;
  uploadedAt: any;
  uploadedBy: string;
}) => {
  try {
    const docRef = await addDoc(attachmentsCollection(projectId, taskId), {
      ...attachmentData,
      uploadedAt: attachmentData.uploadedAt || new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding attachment:', error);
    throw error;
  }
};