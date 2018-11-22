export default (bytes) => {
  // bytes
  if (bytes < 1024) return bytes + 'Bytes';
  const kb = (bytes / 1024).toFixed(1);
  if (kb < 1024) return kb + 'Kb';
  const mb = (kb / 1024).toFixed(1);
  if (mb < 1024) return mb + 'Mb';
  const gb = (mb / 1024).toFixed(1);
  return gb + 'Gb';
}