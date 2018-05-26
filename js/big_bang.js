/**
 * WS is a data structure that describes
 * the state of the world within the defined game data
 * 
 * HandlerCollection is an object with fields
 * - onTick (WS->...)
 * - onKey (WS Key -> ...)
 * - toDraw (WS -> ...)
 * - stopWhen (WS -> Boolean)
 */
 
/**
 * WS HandlerCollection -> void
 * Simple game engine.
 */
function BigBang(ws,hc) {
  
  const TIME_DELAY = 500;
  let intervalId = null;
  
  let keyEventListener = (event) => {
    if(hc.hasOwnProperty("onKey")) hc.onKey(ws,event.keyCode);
  };
  
  let animate = (ts) => {
    
    document.addEventListener(
      "keydown",keyEventListener,{capture:true,once:true});
    
    if(hc.hasOwnProperty("onTick")) if(!ws.paused) hc.onTick(ws); 
    
    if(hc.hasOwnProperty("toDraw")) hc.toDraw(ws);
    
    if(hc.hasOwnProperty("stopWhen")) {
      hc.stopWhen(ws) ? 
        window.clearInterval(intervalId) : start();
    } else {
      start();
    }
  };
  
  let start = () => {
    intervalId = window.setTimeout(
      window.requestAnimationFrame,TIME_DELAY,animate);
  };
  
  return {
    start:start,
  };
}