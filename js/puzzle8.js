/*

*/

var runTests = false;

if (runTests) {
  const assert = require('assert');
}

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

/**
 * Produce a Board with an empty tile 
 * at position numEmpty switched to dir 
 * @param {Board} board 
 * @param {Direction} dir 
 * @param {Natural} numEmpty 
 * @returns Board
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

/**
 * Return true if b1 is equivalent to b2
 * @param {Board} b1 
 * @param {Board} b2 
 * @returns Boolean
 */
function eqBoards(b1,b2) {
  return b1.reduce((base,elem,index)=>{
    return base && (elem===b2[index]); 
  },true);
}

/**
 * Create an array of neighbouring states 
 * @param {P8State} state 
 * @returns P8State*
 */
function produceNeighbourStates(state) {
  let numEmpty = state.board.indexOf("-");
  return getLegalDirections(state.board,numEmpty)
    .reduce((acc,dir)=>{
      let board = switchTilesToDir(state.board,dir,numEmpty);
      if(state.parent==null ||
          !eqBoards(board,state.parent.board)) {
        let nextState = {};
        nextState.board = board;
        nextState.moves = state.moves+1;
        nextState.parent = state;
        nextState.score = countDisplacedTiles(board);
        acc.push(nextState);
      }
      return acc;
  },[]); 
}
if (runTests) {
  let state1 = {board:board2,moves:0,parent:null};
  let neighbours = produceNeighbourStates(state1);
}

/**
 * Count number of tiles on the board
 * that are out of order 
 * @param {Board} board 
 * @returns natural 
 */
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

}

/**
 * @param {Number} a 
 * @param {Number} b 
 * @param {Boolean} op 
 * @returns Boolean
 */
function comp(a,b,op) { return op ? a > b : a < b;}

/** 
 * Dequeue according to rules of Priority Queue
 * @param {Queue<X>} queue
 * @param {(X -> Number)} getScore
 * @param {Boolean} max
 * @returns {X}
 */
function dequeuePQ(queue,getScore,max=true) {
  if(queue.length==0) {
    throw new Error("Queue is empty");
  } else {
    let searchData = queue.reduce((data,elem,index)=>{
      let currentScore = getScore(elem);
      if (comp(currentScore,data.score,max)) {
        return {score:currentScore,index:index,value:elem};
      } else {
        return data;
      }
    },{score:getScore(queue[0]),index:0,value:queue[0]});

    queue[searchData.index] = queue[queue.length-1];
    queue.pop();
    return searchData.value;
  }
}
if (runTests) {
  let queue1 = [1,3,2];
  assert.equal(dequeuePQ(queue1,(elem)=>{return elem;}),3); 
  assert.deepEqual(queue1,[1,2]); 

  queue1 = [1,3,2];
  assert.equal(dequeuePQ(queue1,(elem)=>{return elem*-1;}),1); 
  assert.deepEqual(queue1,[2,3]); 
}

/** 
  * Search for a solution to state
  * NOTE: Doesn't stop when the board with 
  *       no solution is in the inital state
  * @param {P8State} state
  * @returns {P8State}
  */
function searchSolution(state) {
  let queue = [];
  while(state.score!=0) {
    queue = queue.concat(produceNeighbourStates(state));
    state = dequeuePQ(
      queue,(elem)=>{return (elem.score+elem.moves);},false);
    //debugger;
  }
  return state;
}
if (runTests) {
  let theBoard = board21;
  let state1 = {
    board:theBoard,
    score:countDisplacedTiles(theBoard),
    moves:0,
    parent:null};
  //let p1 = searchSolution(state1);
  //console.log(stateToArray(p1,[]));
  //console.log(nextSolution(produceNeighbourStates(state1)));
  console.log(searchSolution2(state1));
}

/**
 * Queue<P8State> -> StateStream
 */
function nextSolution(queue) {
  return {
    first:dequeuePQ(queue,(elem)=>{return (elem.score+elem.moves);},false),
    next: (state) => {
      return nextSolution(queue.concat(produceNeighbourStates(state)))},
  };
}


/**
 * P8State -> P8State
 * note: may go do infinite loop
 */
function searchSolution2(state) {
  let link = nextSolution(produceNeighbourStates(state));
  while(link.first.score!=0) {
    link = link.next(link.first);
  }
  return link.first;
}

/**
 * Produce an array of Boards
 * @param {P8State} state
 * @param {Array} acc
 * @returns {Array}
 */
function stateToArray(state,acc) {
    if(state==null) {
        return acc;
    } else {
        return stateToArray(state.parent,acc.concat([state.board]));
    }
}