// add CSS rule
const addRule = (selector, styles) => {
  // get the LAST styleSheet
  const sheet = document.styleSheets[document.styleSheets.length - 1];
  const index = sheet.cssRules.length;
  if (sheet.insertRule) sheet.insertRule(selector + " {" + styles + "}", sheet.cssRules.length);
  else if (sheet.addRule) sheet.addRule(selector, styles);
  return index;
};

// remove CSS rule
const deleteRule = (index) => {
  // get the LAST styleSheet
  const sheet = document.styleSheets[document.styleSheets.length - 1];
  if (sheet.deleteRule) return sheet.deleteRule(index);
  else if (sheet.removeRule) return sheet.removeRule(index);
};

export default {add: addRule, del: deleteRule};