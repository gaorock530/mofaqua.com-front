
import word from './wordcounter';

const utils = {
  map: (value, in_min, in_max, out_min, out_max) => {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  },
  range: (lower, upper) => {
    return Math.floor(Math.random() * (upper - lower)) + lower;
  },
  checkNick: (v) => {
    v = v.trim();
    if (v.match(/[^\w^\u4e00-\u9fa5^'^\s]+/g) || word(v, true, true) > 20) return false;
    return v; 
  },
  checkPass: (v) => {
    let secureLevel = 0;
    // Minimum eight characters, at least one letter and one number:
    if (v.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,128}$/)) secureLevel = 1;
    // Minimum eight characters, at least one letter, one number and one special character
    if (v.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,128}$/) || 
    // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
        v.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,128}$/)) secureLevel = 2;
    // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special characte
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/
    if (v.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[A-Za-z\d\W]{8,128}$/) ||
    // Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character
        v.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[A-Za-z\d\W]{8,128}$/)) secureLevel = 3;
    return secureLevel;
  },
  passLevel: (v) => {
    const value = [{a: '低', c: 'red'}, {a: '中', c: 'yellow'}, {a: '高', c: 'green'}];
    return value[v-1];
  },
  getType: (num) => {
    switch (num) {
      case 1:
        return '展示';
      case 2:
        return '检疫';
      case 3:
        return '隔离';
      case 4:
        return '繁殖';
      case 5:
        return 'Frag';
      default:
        return '展示';
    }
  },
  getLife: (t, num) => {
    if (t) {
      switch (num) {
        case 1:
          return 'FOT';
        case 2:
          return 'NPS';
        case 3:
          return 'LPS';
        case 4:
          return 'SPS';
        case 5:
          return 'MIX';
        default:
          return 'MIX';
      }
    } else {
      if (num === 1) {
        return 'Single';
      }else {
        return 'Mixed';
      }
    }
  }
  //
}

export default utils;