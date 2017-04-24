import Config from 'config/config';

export default class Utils {
  static whichTransitionEvent(el) {
      var t;
      var transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
      }

      for(t in transitions){
          if( el.style[t] !== undefined ){
              return transitions[t];
          }
      }
  }

  static browser () {
    var ua= navigator.userAgent, tem, 
      M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    
    if(/trident/i.test(M[1])){
      tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
      return ['IE', (tem[1] || '') ];
    }
    
    if(M[1]=== 'Chrome'){
      tem= ua.match(/\bOPR\/(\d+)/)
      if(tem!= null) return 'Opera '+tem[1];
    }
    
    M= M[2]? [M[1], M[2]]: [navigator.appName.toLowerCase(), navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    
    M[0] = M[0].toLowerCase();

    return M;
  }

  static getOS() {
    var ua = navigator.userAgent;
    var uaindex;
    var userOS;

    // determine OS
    if ( ua.match(/iPad/i) || ua.match(/iPod/i) || ua.match(/iPhone/i) ) {
      userOS = 'iOS';
      uaindex = ua.indexOf( 'OS ' );
    } else if ( ua.match(/Android/i) ) {
      userOS = 'Android';
      uaindex = ua.indexOf( 'Android ' );
    } else {
      userOS = 'unknown';
    }

    return userOS;

    // determine version
    
  }

  static getOSVersion(userOS) {
    var ua = navigator.userAgent;
      var uaindex;
      var userOSver;

    if (userOS === 'iOS') {
      uaindex = ua.indexOf( 'OS ' );
      userOSver = ua.substr( uaindex + 3, 3 ).replace( '_', '.' );
    } else if ( userOS === 'Android') {
      uaindex = ua.indexOf( 'Android ' );
      userOSver = ua.substr( uaindex + 8, 3 );
    } else {
      userOSver = 'unknown';
    }
  
    return userOSver;
  }


  /*
   * included support for IE 11 and 12
   * http://stackoverflow.com/questions/19999388/jquery-check-if-user-is-using-ie/21712356#21712356
   */
  static isIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // IE 12 => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return -1;
  }

  static preventScroll() {
    $('html').addClass('no-scroll');
  }

  static permitScroll() {
    $('html').removeClass('no-scroll');
  }

  static scrollTo(options) {
    TweenMax.to(options.el, options.time, {
      scrollTo: { y: options.scrollTop }, 
      ease: Config.defaultEase 
    });
  }
}

window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       || 
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame    || 
      window.oRequestAnimationFrame      || 
      window.msRequestAnimationFrame     || 
      function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
      };
})();

window.requestTimeout = function(fn, delay) {
  if( !window.requestAnimationFrame       && 
    !window.webkitRequestAnimationFrame && 
    !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
    !window.oRequestAnimationFrame      && 
    !window.msRequestAnimationFrame)
      return window.setTimeout(fn, delay);
      
  var start = new Date().getTime(),
    handle = new Object();
    
  function loop(){
    var current = new Date().getTime(),
      delta = current - start;
      
    delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
  };
  
  handle.value = requestAnimFrame(loop);
  return handle;
};

/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
window.clearRequestTimeout = function(handle) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
    window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
    window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
    window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
    window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
    clearTimeout(handle);
};

window.requestInterval = function(fn, delay) {
  if( !window.requestAnimationFrame       && 
    !window.webkitRequestAnimationFrame && 
    !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
    !window.oRequestAnimationFrame      && 
    !window.msRequestAnimationFrame)
      return window.setInterval(fn, delay);
      
  var start = new Date().getTime(),
    handle = new Object();
    
  function loop() {
    var current = new Date().getTime(),
      delta = current - start;
      
    if(delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }

    handle.value = requestAnimFrame(loop);
  };
  
  handle.value = requestAnimFrame(loop);
  return handle;
}


window.clearRequestInterval = function(handle) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
    window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
    window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
    window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
    window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
    clearInterval(handle);
};





