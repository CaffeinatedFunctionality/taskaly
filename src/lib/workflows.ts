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
  updateDoc,
  getDoc
} from 'firebase/firestore';

export const workflowsCollection = collection(db, 'workflows');

export const subscribeToWorkflows = (callback: (workflows: any[]) => void) => {
  const q = query(workflowsCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const workflows: any[] = [];
    snapshot.forEach((doc) => {
      workflows.push({ id: doc.id, ...doc.data() });
    });
    callback(workflows);
  });
};

export const addWorkflow = async (workflowData: { 
  title: string; 
  description: string; 
  trigger: any; // We'll define a more specific type later
  actions: any[];
  isActive: boolean;
  createdAt: any;
}) => {
  try {
    const docRef = await addDoc(workflowsCollection, {
      ...workflowData,
      createdAt: workflowData.createdAt || new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding workflow: ', error);
    throw error;
  }
};

export const updateWorkflow = async (workflowId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'workflows', workflowId), data);
  } catch (error) {
    console.error('Error updating workflow: ', error);
    throw error;
  }
};

export const deleteWorkflow = async (workflowId: string) => {
  try {
    await deleteDoc(doc(db, 'workflows', workflowId));
  } catch (error) {
    console.error('Error deleting workflow: ', error);
    throw error;
  }
};

export const getWorkflow = async (workflowId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'workflows', workflowId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting workflow: ', error);
    throw error;
  }
};