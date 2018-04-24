# NEXT

* Read assignment and explore non-solvable boards 
   * Experiment with running code on unsolvable boards, switch any tiles and re-run

# REFERENCE

[1]: http://coursera.cs.princeton.edu/algs4/assignments/8puzzle.html “8 Pzl Prnctn”
[2]:  https://goo.gl/5K9LbM “Berkley AI”
[3]: https://algs4.cs.princeton.edu/home/ “Algorithms Princeton” 
[4]: https://goo.gl/PQDjmR “Codepen prototype”
[5]: https://dgurkaynak.github.io/8-puzzle-solver/ “8 Pzl Solver”

# PERSONAL NOTES AND TAKEAWAYS
- What is tail recursive function and is it possible and does it make sense to design one in Javascript.
- Effective (almost native) Javascript testing. 
- How A* is different from BFS, and other options. 

# DATA TYPES

## Tile 
Tile is either:
* Natural number from 1 to 8 inclusive
* Null value (or similar)

## Board 
Board is a vector where keys represent cell number and values represent tiles that occupy that cells.

## Direction 
Direction is either: “L”, “R”, “U”, “D”, meaning left, right, up, and down.

## Direction Offset 
Is a dictionary with Directions as keys and offset number - a number to add to a current cell to get a new cell value - as values.

## Priority Queue
A sequence of elements, Puzzle 8 States in particular

## Dequeue Data
A record that contains data on dequeued from priority queue element:
* its score defined by the provided score function (Number),
* index (Natural),
* value (Any)

## Puzzle 8 State
- null
- an object with fields:
    * board (Board)
    * score (Natural)
    * number of moves (Natural)
    * parent state (Puzzle 8 State) 

#ACTIONS

## Move Tile to an Empty Space 
Board, Direction -> Board
Empty Tile is surrounded by a number of non-empty Tiles. The number ranges from 2 to 4 depending on a position of an empty Tile within the Board.
Based on a given Board and Direction produce a new Board with an empty Tile moved to that Direction and exchanged places with the other Tile that previously occupied the place. Signal an error if an action is not possible because an empty Tile hits a border of the Board.

## Get a list of directions to moves: 
Board -> Direction*
According to the current state of the Board get a list of directions where the empty Tile can be moved, exchanged places with the other non-empty Tile.

## Compute the number of displaced tiles
Board -> Natural [0,9]
1 2 3
4 5 6
7 8 - is 0
===
- 1 3
4 2 5
7 8 6 is 5
===
6 1 3
4 2 5
7 8 - is 4

## Enqueue into Priority Queue

## Dequeue from Priority Queue

## Solution Search
First, insert the initial search node (Puzzle 8 State) into a priority queue. Then, delete from the priority queue the search node with the minimum priority, and insert onto the priority queue all neighboring search nodes (those that can be reached in one move from the dequeued search node). Repeat this procedure until the search node dequeued corresponds to a goal board.
