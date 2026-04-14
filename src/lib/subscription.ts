import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const userDoc = doc(db, 'users', user.uid);
    const fetchSubscription = async () => {
      try {
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSubscription(data.subscription || null);
        } else {
          setSubscription(null);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return { subscription, loading };
};