import { useState, useMemo, useEffect, useRef } from "react";
import { Direction } from "../../share/direction";
import { Point } from "../../share/point";

class SnakeEngine {
  chain: Point[];
  setDirection: (d: Direction) => void;

  constructor(chain: Point[], setDirection: (d: Direction) => void) {
    this.setDirection = setDirection;
    this.chain = chain;
  }

  direction(): SnakeEngine {
    return this;
  }

  moveUp() {
    if (this.chain.length < 2) return;
    const last = this.chain[this.chain.length - 1];
    const prev = this.chain[this.chain.length - 2];
    if (prev.x === last.x) return;
    this.setDirection(Direction.Up);
  }

  moveDown() {
    if (this.chain.length < 2) return;
    const last = this.chain[this.chain.length - 1];
    const prev = this.chain[this.chain.length - 2];
    if (prev.x === last.x) return;
    this.setDirection(Direction.Down);
  }

  moveLeft() {
    if (this.chain.length < 2) return;
    const last = this.chain[this.chain.length - 1];
    const prev = this.chain[this.chain.length - 2];
    if (prev.y === last.y) return;
    this.setDirection(Direction.Left);
  }

  moveRight() {
    if (this.chain.length < 2) return;
    const last = this.chain[this.chain.length - 1];
    const prev = this.chain[this.chain.length - 2];
    if (prev.y === last.y) return;
    this.setDirection(Direction.Right);
  }
}

class SnakeChain {
  chain: Point[];

  constructor(chain: Point[]) {
    this.chain = [...chain];
  }

  moveOneFromBegin() {
    if (this.chain.length < 2) return this;
    const first = this.chain[0];
    const second = this.chain[1];
    if (Math.max(Math.abs(first.x - second.x), Math.abs(first.y - second.y)) === 1) {
      this.chain.shift();
    } else {
      if (first.x === second.x) {
        first.y = first.y + (first.y > second.y ? -1 : 1);
      } else {
        first.x = first.x + (first.x > second.x ? -1 : 1);
      }
    }
    return this;
  }

  addPointToEnd(direction: Direction) {
    if (this.chain.length < 2) return this;
    const last = this.chain[this.chain.length - 1];
    const prev = this.chain[this.chain.length - 2];
    switch (direction) {
      case Direction.Up: {
        if (last.x === prev.x) { last.y = last.y - 1 }
        else {
          this.chain.push({ x: last.x, y: last.y - 1 });
        }
        break;
      };
      case Direction.Down: {
        if (last.x === prev.x) { last.y = last.y + 1 }
        else {
          this.chain.push({ x: last.x, y: last.y + 1 });
        }
        break;
      };
      case Direction.Left: {
        if (last.y === prev.y) { last.x = last.x - 1 }
        else {
          this.chain.push({ y: last.y, x: last.x - 1 });
        }
        break;
      };
      case Direction.Right: {
        if (last.y === prev.y) { last.x = last.x + 1 }
        else {
          this.chain.push({ y: last.y, x: last.x + 1 });
        }
        break;
      };
    }
    return this;
  }

  get() {
    return this.chain;
  }
}

class SnakeTime {
  interval: NodeJS.Timeout;
  subscriber: (() => void) | undefined;

  constructor() {
    this.interval = setInterval(this.tick, 500);
  };

  tick = () => {
    this.subscriber && this.subscriber();
  }

  subscribe(subscriber: () => void) {
    this.subscriber = subscriber;
  }

  reset() {
    clearInterval(this.interval);
  }
}

export function useSnakeModel(width: number, height: number) {
  const [direction, setDirection] = useState(Direction.Right);
  const [snake, setSnake] = useState({
    chain: [
      { x: Math.ceil(width / 2 - 1), y: Math.ceil(height / 2 - 1) },
      { x: Math.ceil(width / 2 + 1), y: Math.ceil(height / 2 - 1) }
    ]
  });

  const timer = useRef(new SnakeTime());
  useEffect(() => {
    return () => timer.current.reset();
  });

  const engine = useMemo(() => new SnakeEngine(snake.chain, setDirection), [snake.chain]);
  useEffect(() => {
    timer.current.subscribe(() => {
      setSnake({
        chain: new SnakeChain(snake.chain)
          .moveOneFromBegin()
          .addPointToEnd(direction)
          .get()
      })
    });
  }, [snake, direction]);


  useEffect(() => {
    const interval = setInterval(() => {
      setSnake({
        chain: new SnakeChain(snake.chain)
          .moveOneFromBegin()
          .addPointToEnd(direction)
          .get()
      })
    }, 500);
    return () => clearInterval(interval)
  }, [snake, direction]);

  return { snake, engine };
}