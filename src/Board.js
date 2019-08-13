import React, { Component } from 'react';
import Cell from './Cell';
import './Board.css';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.25
  };
  constructor(props) {
    super(props);
    this.createBoard = this.createBoard.bind(this);
    this.createRow = this.createRow.bind(this);
    this.flipCellsAround = this.flipCellsAround.bind(this);
    this.state = {
      hasWon: false,
      board: this.createBoard()
    };
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  createRow() {
    let arr = Array.from({ length: this.props.ncols });
    return arr.map(() => {
      return Math.random() < this.props.chanceLightStartsOn;
    });
  }
  createBoard() {
    // TODO: create array-of-arrays of true/false values
    let arr = Array.from({ length: this.props.nrows });
    return arr.map(() => {
      return this.createRow();
    });
    // let board = [];
    // for (let i = 0; i < this.props.nrows; i++) {
    //   let row = [];
    //   for (let j = 0; j < this.props.ncols; j++) {
    //     row.push(Math.random() < this.props.chanceLightStartsOn)
    //   }
    //   board.push(row)
    // }
    // return board
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split('-').map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    // TODO: flip this cell and the cells around it
    flipCell(y, x); //Flips cell itself
    flipCell(y, x + 1); //Flips right neighbour
    flipCell(y, x - 1); //Flips left neighbour
    flipCell(y - 1, x); //Flips above neighbour
    flipCell(y + 1, x); //Flips below neighbour

    // win when every cell is turned off
    // TODO: determine is the game has been won
    const hasWon = board.every(rows => rows.every(col => col === false));

    this.setState({ board, hasWon });
  }

  /** Render game board or winning message. */

  render() {
    // if the game is won, just show a winning msg & render nothing else
    if (this.state.hasWon) {
      return (
        <div className='Board-title'>
          <div className='winner'>
            <span className='neon-orange winner-title'>Congratulations,</span>
            <span className='neon-blue winner-title'>You WON!!</span>
          </div>
        </div>
      );
    }
    let tableBody = [];
    for (let i = 0; i < this.props.nrows; i++) {
      let row = [];
      for (let j = 0; j < this.props.ncols; j++) {
        row.push(
          <Cell
            key={i + '-' + j}
            coord={i + '-' + j}
            isLit={this.state.board[i][j]}
            flipCellsAroundMe={this.flipCellsAround}
          />
        );
      }
      tableBody.push(<tr key={i}>{row}</tr>);
    }
    return (
      <div>
        <div className='Board-title'>
          <div className='neon-orange'>Lights</div>
          <div className='neon-blue'>Out</div>
        </div>
        <table className='Board'>
          <tbody>{tableBody}</tbody>
        </table>
      </div>
    );
  }
}

export default Board;
