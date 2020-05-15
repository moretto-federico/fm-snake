import { useState, useMemo, useEffect, useRef } from "react";
import { Direction } from "../../share/direction";
import { Point } from "../../share/point";

function doOnSegment(pointA: Point, pointB: Point, action: (varCoor: 'x' | 'y', fixCoord: 'x' | 'y', dir: Direction) => any) {
  if (pointA.x === pointB.x) {
    return action('y', 'x', pointA.y > pointB.y ? Direction.Up : Direction.Down);
  } else {
    return action('x', 'y', pointA.x > pointB.x ? Direction.Left : Direction.Right);
  }
}


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
      doOnSegment(first, second, (vc) => { first[vc] = first[vc] + (first[vc] > second[vc] ? -1 : 1) });
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
  interval: number;
  subscriber: (() => void) | undefined;

  constructor() {
    this.interval = window.setInterval(this.tick, 500);
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

class SnakeCollisionDetector {
  detect(chain: Point[], width: number, height: number, onCollision: () => void) {
    const last = chain[chain.length - 1];
    if (last.x === 0 || last.y === 0 || last.x === width - 1 || last.y === height - 1) {
      onCollision();
      return;
    }

    for (let i = 1; i < chain.length - 2; i++) { // it can't be the last two segments!
      const a = chain[i - 1];
      const b = chain[i];
      if (a.x === b.x) {
        for (let y = Math.min(a.y, b.y); y < Math.max(a.y, b.y); y++) {
          if (last.x === a.x && last.y === y) {
            onCollision();
            return;
          }
        }
      } else {
        for (let x = Math.min(a.x, b.x); x < Math.max(a.x, b.x); x++) {
          if (last.y === a.y && last.x === x) {
            onCollision();
            return;
          }
        }
      }
    }
  }
}

export function useSnakeModel(width: number, height: number, onCollision: () => void) {
  const [direction, setDirection] = useState(Direction.Right);
  const [speed, setSpeed] = useState(500);
  const tackCounter = useRef(0);
  const [snake, setSnake] = useState({
    chain: [
      { x: Math.ceil(width / 2 - 5), y: Math.ceil(height / 2 - 1) },
      { x: Math.ceil(width / 2 + 5), y: Math.ceil(height / 2 - 1) }
    ]
  });

  const timer = useRef(new SnakeTime());
  useEffect(() => {
    return () => timer.current.reset();
  });

  const engine = useMemo(() => new SnakeEngine(snake.chain, setDirection), [snake.chain]);
  useEffect(() => {
    let newSnake;
    const interval = setInterval(() => {
      tackCounter.current = tackCounter.current + 1;
      if (tackCounter.current % 10 === 0) {
        setSpeed(s => s * 0.9);
        newSnake = {
          chain: new SnakeChain(snake.chain)
            .addPointToEnd(direction)
            .get()
        };
      } else {
        newSnake = {
          chain: new SnakeChain(snake.chain)
            .moveOneFromBegin()
            .addPointToEnd(direction)
            .get()
        };
      }
      new SnakeCollisionDetector().detect(snake.chain, width, height, onCollision);
      setSnake(newSnake);
    }, speed);
    return () => clearInterval(interval)
  }, [speed, snake, direction, width, height, onCollision]);

  return { snake, engine };
}