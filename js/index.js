var DirOffset = {"L":-1, "R": 1, "U":-3, "D":3};
var board1 = [1,2,3,4,5,6,7,8,"-"];
var board2 = [1,2,3,4,"-",6,7,8,5];
var board21 = [1,2,3,6,"-",4,7,8,5];
var board3 = [1,2,3,4,5,6,"-",7,8];
var board4 = [1,2,3,4,5,6,7,"-",8];
var board5 = ["-",1,3,4,2,5,7,8,6];

// Board -> String
// create a string representation of a board
function boardToString(board) {
  return board.reduce((result,cell,cellNum)=>{
    let suffix = (cellNum+1)%3==0 ? '\n' : '  '; 
    return result+`${cell}${suffix}`;
  },"");
}
/*
boardToString(board1);
1 2 3
4 5 6
7 8 -
*/
/* Board Natural -> Array<Direction>
   based on a position of an empty tile,
   get the list of possible directions to move
*/
function getLegalDirections(board,numEmpty) {
  if (numEmpty==0) {
    return ["R","D"];
  } else if (numEmpty==2) {
    return ["L","D"];
  } else if (numEmpty==6) {
    return ["R","U"];
  } else if (numEmpty==8) {
    return ["L","U"];
  } else if (numEmpty==1) {
    return ["R","L","D"];
  } else if (numEmpty==3) {
    return ["R","D","U"];
  } else if (numEmpty==5) {
    return ["L","D","U"];
  } else if (numEmpty==7) {
    return ["R","L","U"];
  } else {
    return ["R","L","U","D"];
  }
}

/* Board Direction -> Board
   change position of empty tile in board
   and return board object
*/
function makeMove(board,dir) {
  let numEmpty = board.indexOf("-");
  let moveAllowed = getLegalDirections(board,numEmpty).includes(dir);
  if(moveAllowed) {
    return switchTilesToDir(board,dir,numEmpty);
  } else {
    throw new Error("Illegal move");
  }
}

/* Board Direction Natural -> Board
   switch tiles in board
*/
function switchTilesToDir(board,dir,numEmpty) {
    let newEmpty = numEmpty+DirOffset[dir];
    return board.map((tile,index)=>{
      if(index==numEmpty) {
        return board[newEmpty];
      } else if(index==newEmpty) {
        return "-";
      } else {
        return tile;
      }
    });
}

/* Board Board -> Boolean
   return true if b1 is equivalent to b2
*/
function eqBoards(b1,b2) {
  return b1.reduce((base,elem,index)=>{
    return base && (elem===b2[index]); 
  },true);
}

/* P8State -> *P8State */
function produceNeighbourStates(state) {
  let numEmpty = state.board.indexOf("-");
  let neighbours = [];
  getLegalDirections(state.board,numEmpty).forEach((dir)=>{
    let board = switchTilesToDir(state.board,dir,numEmpty);
    if(state.parent==null ||
        !eqBoards(board,state.parent.board)) {
      let nextState = {};
      nextState.board = board;
      nextState.moves = state.moves+1;
      nextState.parent = state;
      neighbours.push(nextState);
    }
  }); 
  return neighbours;
}
{
  /*
  let state1 = {board:board2,moves:0,parent:null};
  let neighbours = produceNeighbourStates(state1);
  console.log(neighbours);
  */
}

/* Board -> Natural */
function countDisplacedTiles(board) {
  return board.reduce((total,tile,cellNum)=>{
    let gain;
    if (cellNum<8) {
      gain = (cellNum+1)==tile ? 0 : 1;
    } else {
      gain = "-"==tile ? 0 : 1;
    }
    return total+gain;
  },0);
}
{
  //console.log(countDisplacedTiles(board1) == 0);
  //console.log(countDisplacedTiles(board3) ==  2);
}

/* Queue<X> (X -> Number)-> DequeueData 
   dequeue according to rules of Priority Queue
   NOTE: to test
*/
function dequeuePQ(queue,getScore) {
  if(queue.length==0) {
    
  } else {
    let maxScoreVI = queue.reduce((data,elem,index)=>{
      let currentScore = getScore(elem);
      if (currentScore>data.score) {
        return {score:currentScore,index:index,value:elem};
      } else {
        return data;
      }
    },{score:getScore(queue[0]),index:0,value:queue[0]});

    queue[maxScoreVI.index] = queue[queue.length-1];
    queue.pop();

    return maxScoreVI;
  }
}
{
  /*
  let queue1 = [1,3,2];
  console.log(dequeuePQ(queue1,(elem)=>{return elem;})); // 3
  console.log(queue1); // [1, 2]
  */
}

/* P8State Queue -> P8State
   NOTE: Doesn't stop!!!
*/
function searchSolution(state,queue) {
  if(countDisplacedTiles(state.board)==0) {
    return state;
  } else {
    queue = queue.concat(produceNeighbourStates(state));
    let item = dequeuePQ(queue,(elem)=>{
      return (countDisplacedTiles(elem.board)+state.moves)*(-1);
    });
    debugger;
    return searchSolution(item.value,queue);
  }
}
{
  let state1 = {board:board2,moves:0,parent:null};
  let p1 = searchSolution(state1,[]);
  console.log(p1);
}


function init(board) {
  
  let pre = document.querySelector("pre");
  let messageBox = document.querySelector("#message");
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
}

//init(board2);
