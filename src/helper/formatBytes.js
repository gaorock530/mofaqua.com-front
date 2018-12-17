export default (bytes) => {
  // bytes
  if (bytes < 1000) return bytes + 'Bytes';
  const kb = (bytes / 1000).toFixed(1);
  if (kb < 1000) return kb + 'Kb';
  const mb = (kb / 1000).toFixed(1);
  if (mb < 1000) return mb + 'Mb';
  const gb = (mb / 1000).toFixed(1);
  return gb + 'Gb';
}