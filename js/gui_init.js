// requires functions defined in puzzle8.js

function init(board) {
  
  let pre = document.querySelector("main > section:nth-of-type(1) > pre");
  
  pre.textContent = boardToString(board);
  
  let arrows = {
    "ArrowUp": "D",
    "ArrowDown": "U",
    "ArrowLeft": "R",
    "ArrowRight": "L",
  };
  
  document.addEventListener("keydown",(event) => {
    const keyName = event.key;
    try {
      if(arrows.hasOwnProperty(keyName)) {
        board = makeMove(board,arrows[keyName]);
        pre.textContent = boardToString(board);
      }
    } catch (e) {
      //console.log(e.message);
    }
  }); 

   let button = document.querySelector("main > section:nth-of-type(2) > button");
   
   button.addEventListener("click",(event)=>{

     function onTick(data) {
       pre.textContent = boardToString(data.value.board);
       return stream.next();
     }
     
     function stopWhen(data) {
       return data.done;
     }
  
     let state1 = {
       board:board,
       score:countDisplacedTiles(board),
       moves:0,
       parent:null};
       
      const stream = arrStream(stateToArray(searchSolution(state1)));
    
      let bb = new BigBang(
        stream.next(),
        {onTick: onTick, stopWhen: stopWhen}); 
        
       bb.start();
   });
}

init(board21);