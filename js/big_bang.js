/* Integer Integer -> Integer
   produce random integer within range [min,max]
*/
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }
  
  /*
      X
      (X->X|undefined),
      (X KeyboardEvent.key -> X|undefined),
      (X -> void),
      (X -> Boolean) -> void
    
    Starts browser page animation given
    ws as a representation of a world state and
    onTick,onKey, toDraw which mutate state
    on a world clock tick, respond to keyboard
    input, draw the current state on page
  */
  function BigBang(ws,onTick,onKey,toDraw,stopWhen) {
    
    let PAUSE_KEY = 80;
    let intervalId = null;
    let intervalIdKey = null; // keep key events within one tick time
    let tickInterval = 1000;
    
    let keyEventListener = (event) => {
      if(!stopWhen(ws)) {
        if(event.keyCode==PAUSE_KEY&&!ws.paused) {
          ws.paused = true;
        } else if(ws.paused) {
          if(event.keyCode==PAUSE_KEY) {
            ws.paused = false;
            start();
          }
        } else if (!ws.puased) {
          if(intervalId!=intervalIdKey) {
            onKey(ws,event.keyCode);
          } 
          intervalIdKey = intervalId;
        }
        document.addEventListener(
          "keydown",keyEventListener,{capture:true,once:true});
      } 
    };
    
    let start = () => {
  
      document.addEventListener(
        "keydown",keyEventListener,{capture:true,once:true});
  
      let animate = (ts) => {
        onTick(ws); toDraw(ws);
        if(stopWhen(ws)||ws.paused) {
            window.clearInterval(intervalId);
            console.log("game stopped");
        } else {
          intervalId = window.setTimeout(window.requestAnimationFrame,tickInterval,animate);
        }
      };
  
      intervalId = window.setTimeout(window.requestAnimationFrame,tickInterval,animate);
  
    };
    
    return {
      start:start,
    };
    
  }