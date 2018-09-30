import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={ props.isWinner ? 'square active' : 'square'} onClick={props.onClick }>
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={`board-square-${i}`}
        isWinner={this.isWinner(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  isWinner(i) {
    if (this.props.winner) {
      if (this.props.winner.combination.includes(i)) {
        return true;
      }
    }
    return false;
  }

  squaresGroup(i) {
    const squares = [];
    const from = (i - 1) * 3;
    for (let j = from; j < (from + 3); j += 1) {
      squares.push(this.renderSquare(j));
    }
    return squares;
  }

  render() {
    const rows = [];
    for (let i = 1; i <= 3; i += 1) {
      rows.push(
        <div className="board-row" key={`board-row-${i}`}>
          { this.squaresGroup(i) }
        </div>
      );
    }

    return (
      <div>
        { rows }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        positionClicked: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares,
        positionClicked: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 
        `Go to move #${move} - ${getCoords(step.positionClicked)}`:
        'Go to game start';
      return (
        <li key={move} className={(move === this.state.stepNumber) ? 'active' : '' }>
          <button onClick={() => { this.jumpTo(move)}}>{ desc }</button>
        </li>
      )
    });

    let status;
    if (winner) {
        status = `Winner ${winner.winner}`;
    } else {
        status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winner={winner}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        combination: lines[i],
      };
    }
  }
  return null;
};

function getCoords(index) {
  let row = 1;
  let col = 1;
  // rows
  if (index < 3) row = 1;
  else if (index < 6) row = 2;
  else row = 3;
  // cols
  if (index === 0 || index === 3 || index === 6) col = 1;
  else if (index === 1 || index === 4 || index === 7) col = 2;
  else col = 3;

  return `[${row}, ${col}]`;
}
