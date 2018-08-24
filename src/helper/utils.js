

const utils = {
  map: (value, in_min, in_max, out_min, out_max) => {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  },
  range: (lower, upper) => {
    return Math.floor(Math.random() * (upper - lower)) + lower;
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