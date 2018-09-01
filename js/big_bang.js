function BigBang(ws,hc) {
  
  let intervalId = null;
  
  const identFunc = ws => {return ws;}; 
  
  const handlers = {
    onTick: hc.onTick ? hc.onTick : identFunc,
    toDraw: hc.toDraw ? hc.toDraw : identFunc,
    onKey: hc.onKey ? hc.onKey : identFunc,
    stopWhen: hc.stopWhen ? hc.stopWhen : (ws) => {return false;},
    runAfter: hc.runAfter ? hc.runAfter : identFunc,
  };
  
  let keyEventObject = {
    ws:ws,
    handleEvent: function(event) {
      //console.log(event.code);
      this.ws = handlers.onKey(this.ws,event.code);
    },
    animate: function() {
      document.addEventListener(
        "keydown",this,{capture:true,once:true});
      this.ws = handlers.onTick(this.ws);
      handlers.toDraw(this.ws);
      start(this.ws);
    }
  }
  let fps = 1;
  let start = (ws) => {
    if(handlers.stopWhen(ws)) {
      console.log('game stopped');
      window.clearInterval(intervalId);
      handlers.runAfter(ws);
    } else {
      setTimeout(()=>{
        intervalId = window.requestAnimationFrame(ts=>{keyEventObject.animate(ws)});
      },1000/fps);
    }
  };
  
  return {
    start: () => {start(ws)}
  };
}