const pendingRequests = new Map<string, boolean>();

export const guardRequest = async (
  key: string,
  fn: () => Promise<void>
): Promise<void> => {
  if (pendingRequests.get(key)) return;
  pendingRequests.set(key, true);
  try {
    await fn();
  } finally {
    pendingRequests.delete(key);
  }
};