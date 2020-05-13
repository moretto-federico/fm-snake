import React from 'react';
import ReactDOM from 'react-dom';

import Board from './components/Board';
import Snake from './components/Snake';

ReactDOM.render(
  <div style={{ width: "600px", height: "500px", backgroundColor: "red", position: "relative" }}>
    <Board width={60} height={50} size={10} />
  </div>,
  document.getElementById('fm-snake'),
);

/*
ReactDOM.render(
  <div style={{ width: "600px", height: "500px", backgroundColor: "red", position: "relative" }}>
    <Snake chain={[{ x: 52, y: 14 }, { x: 52, y: 13 }, { x: 51, y: 13 }]} size={10} />
  </div>,
  document.getElementById('fm-snake'),
);
*/
