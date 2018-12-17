/**
 * @param {String} string Time string
 * @param {Number} expires set days to expire
 */
export default (string) => {
  const time = new Date(string);
  const format = [
    time.getUTCFullYear(),
    time.getUTCMonth(),
    time.getUTCDay(),
    time.getUTCHours(),
    time.getUTCMinutes(),
    time.getUTCSeconds()
  ].map(s => {
    if (s.toString().length === 1) return '0' + s;
    return s;
  })
  return `${format[0]}-${format[1]}-${format[2]} ${format[3]}:${format[4]}:${format[5]}`
}