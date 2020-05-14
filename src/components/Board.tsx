import React, { useCallback, useEffect, useState } from "react"
import Snake from "./Snake";
import { useSnakeModel } from "./hooks/useSnakeModel";

export type BoardProps = {
  width: number,
  height: number,
  size: number,
}


/**
 * The snake board.
 */
export default function Board(props: BoardProps) {
  const { width, height, size } = props;

  const [collisionDetected, setCollisionDetected] = useState(false);
  const onCollision = useCallback(() => setCollisionDetected(true), []);

  const { snake, engine } = useSnakeModel(width, height, onCollision);

  const keyPressed = useCallback((evt: KeyboardEvent) => {
    if (evt.key.startsWith('Arrow')) {
      switch (evt.key) {
        case 'ArrowUp': { engine.direction().moveUp(); break; }
        case 'ArrowDown': { engine.direction().moveDown(); break; }
        case 'ArrowLeft': { engine.direction().moveLeft(); break; }
        case 'ArrowRight': { engine.direction().moveRight(); break; }
      }
    }
  }, [engine])

  useEffect(() => {
    window.addEventListener('keydown', keyPressed);
    return () => window.removeEventListener('keydown', keyPressed);
  })

  return (
    <div className="fm-snake-board">
      {collisionDetected && <div>The End!</div>}
      {!collisionDetected && <Snake chain={snake.chain} size={size} />}
    </div>
  )

  return null;
}