import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//demo学习 测试01
// 游戏每个格子,使用button渲染
//方法一: Square组件的class组件写法
/* 
class Square extends React.Component {
    // 如果不需要state,则也不需要constructor
    // constructor(props){
    //     super(props);
    //     this.state = {
    //         value: null,
    //     };
    // }
    render() {
        // 监听点击事件,调用父组件传递过来的方法
        return (
            <button className="square" 
            onClick={() => this.props.onClick() }>
                {this.props.value}
            </button>
        )
    }
} */

// 方法二: Square组件的函数组件写法
// 通常不需要state的时候,使用函数组件更为方便
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}
// 游戏面板九宫格
class Board extends React.Component {
  renderSquare(i) {
    // 此处绑定的onClick是一个自定义方法,把这里onClick改成squareClick亦可,在square中调用时也用squareClick即可
    return (
      <Square value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// 顶层父组件
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }
  handleClick(i) {
    // 保证 点击历史记录后再走棋时未来的记录丢弃
    const history = this.state.history.slice(0,this.state.stepNumber + 1)
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // 有胜者出现或者点了已被点过的格子,不处理
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length, //正向走棋每次更新步数
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    //历史记录走棋更新步数和下一位玩家
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // 这个moves等于是一个局部组件,只是没有抽离出来
    const moves = history.map((step,move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )

    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
          onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// 判断胜利者
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

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}