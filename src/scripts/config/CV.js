import Utils from 'components/utils';

//current values
var CV = {
  viewport: { width: 0, height: 0 },
  bkpt: null,
  touch: { x: 0, y: 0, startX: 0, startY: 0, deltaX: 0, deltaY: 0, direction: null },
  scroll: { y: 0 },
  scrollEl: null,
  isTouchDevice : 'ontouchstart' in document.documentElement,
  OS: Utils.getOS(),
  isIE: Utils.isIE(),
  isChrome: /CriOS/.test(navigator.userAgent),
  OSVersion: Utils.getOSVersion(Utils.getOS()),
  isiPhone: /iPhone/i.test(navigator.userAgent) || /iPod/i.test(navigator.userAgent),
  animate: false,
  customScroll: false
}



export default CV;

