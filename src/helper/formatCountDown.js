export default (second) => {
  if (second < 60) return second + '秒';
  const minutes = Math.floor(second / 60);
  if (minutes < 60) return minutes + '分' + (second % 60 )+'秒';
  const hours = Math.floor(minutes / 60);
  return hours + '小时' + minutes + '分' + (second % 60 )+'秒';
}