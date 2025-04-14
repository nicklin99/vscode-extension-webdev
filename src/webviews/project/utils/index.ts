export const formatDateTime = (v?: string) => {
  if (!v) {
    return;
  }
  return new Date(v).toLocaleString();
};
