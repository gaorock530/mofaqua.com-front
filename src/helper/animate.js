export default (el, type) => {
  const list = {
    animate: {
      "animation"      : "animationend",
      "OAnimation"     : "oAnimationEnd",
      "MozAnimation"   : "animationend",
      "WebkitAnimation": "webkitAnimationEnd"
    },
    transitions: {
      "transition"      : "transitionend",
      "OTransition"     : "oTransitionEnd",
      "MozTransition"   : "transitionend",
      "WebkitTransition": "webkitTransitionEnd"
    }
  }

  const name = list[type];
  if (!name) throw Error('type name Wrong!'); 

  for (let t in name){
    if (el.style[t] !== undefined){
      return name[t];
    }
  }
}