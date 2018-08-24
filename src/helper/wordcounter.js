/**
 * @param {String} word the string to work with
 * @param {Boolean} trim if the word need to be trimmed
 * @param {Boolean} space is the string allowed to have space in between
 * @param {Number} type 0-any, 1-letters and _, 2-only letters
 * @param {Number} output return number of letters end with ...
 */

export default (word, trim = true, space = false, type = 0, output) => {
  /* Initial Checks */
  // check word is valid
  if (typeof word !== 'string' && word.length === 0) 
  throw Error('1st argument must be String, and not Empty');
  // initial counter
  let counter = 0;
  // check if the string need to be trimmed
  if (typeof trim === 'boolean') {
    if (trim) word = word.trim();
  } else throw Error('2nd argument must be Boolean');
  // check space
  if (typeof space === 'boolean') {
    // no space
    if (!space && word.match(/\s/ig)) return false;
  } else throw Error('3rd argument must be Boolean');
  if (typeof type === 'number' && (type === 0 || type === 1 || type === 2)){
    const reg = [/[^\u4e00-\u9fa5^a-z^A-Z^0-9]/ig,/[^\u4e00-\u9fa5^\w]/ig];
    if (type !== 2 && word.match(reg[type]) && !space) return false;
  }else throw Error('4th argument must be a Number (0-only letters and numbers, 1-letters and _, 2-any)');
  // determine Output
  if (typeof output === 'undefined') {
    /* Actual Counting */
    // chinese char
    const ch = word.match(/[^\x00-\xff]/ig);
    const ch_len = ch ? ch.length : 0;
    if (ch) counter += ch_len*2;
    const en = word.length - ch_len;
    counter += en;
    return counter;
  } else if (typeof output !== 'undefined' && typeof output === 'number') {
    let n = 0;
    for (let l of word) {
      if (l.match(/[^\x00-\xff]/)) counter+=2;
      else counter++;
      n++;
      if (counter >= output) return word.slice(0, n).trim() + '...';
    }
    return word;
  } else throw Error('5th argument must Number or Undefined');
}