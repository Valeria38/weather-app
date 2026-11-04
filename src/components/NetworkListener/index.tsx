import { useEffect } from 'react';
import { toast } from 'sonner';

export default function NetworkListener() {
  useEffect(() => {
    const handleOnline = () => {
      toast.success('Internet restored!', {
        description: 'Data automatically synchronized.',
      });
    };

    const handleOffline = () => {
      toast.error("You're offline", {
        description: 'A saved local version is being used.',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
}
