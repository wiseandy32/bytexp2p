import { auth } from '@/lib/firebase';

export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) {
    throw new Error('Session expired. Please log in again.');
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok || !data.url) {
    throw new Error(data.error || 'Upload failed');
  }
  return data.url;
};
