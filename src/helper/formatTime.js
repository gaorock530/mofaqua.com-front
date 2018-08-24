export default (time) => {
  let diff = (Date.now() - time)/1000;
  if (diff<60) { // second
    return (Math.floor(diff)+'秒');
  }else if (diff >=60 && (diff/60) < 60) {
    return (Math.floor(diff/60)+'分钟');
  }else if ((diff/60) >= 60 && (diff/60/60) < 24) {
    return (Math.floor(diff/60/60)+'小时');
  }else if ((diff/60/60) >= 24 && (diff/60/60/24) < 7) {
    return (Math.floor(diff/60/60/24)+'天');
  }else if ((diff/60/60/24) >= 7 && (diff/60/60/24) < 28) {
    return (Math.floor(diff/60/60/24/7)+'周');
  }else if ((diff/60/60/24) >=28 && (diff/60/60/24) < 365) {
    return (Math.floor(diff/60/60/24/28)+'个月');
  }else if ((diff/60/60/24) > 365) {
    return (Math.floor(diff/60/60/24/365)+'年');
  }
}