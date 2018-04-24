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

  function onTick(boards) {
    pre.textContent = boardToString(boards.pop());
  }

  function stopWhen(boards) {
    return boards.length==0;
  }

  let emptyFunc = () => {};

   let button = document.querySelector("main > section:nth-of-type(2) > button");
   button.addEventListener("click",(event)=>{
     let state1 = {
       board:board,
       score:countDisplacedTiles(board),
       moves:0,
       parent:null};
    let bb = new BigBang(
      stateToArray(
        searchSolution(state1),[]).slice(0,-1),onTick,emptyFunc,emptyFunc,stopWhen); 
     bb.start();
   });
}

init(board21);