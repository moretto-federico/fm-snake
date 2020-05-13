import React from "react";
import { Direction } from "../share/direction";
import { Point } from "../share/point";



function getSegments(chain: Point[]) {
  const segments = [];
  for (let i = 1; i < chain.length; i++) {
    segments.push([chain[i - 1], chain[i]]);
  }
  return segments;
}

export type SegmentProps = {
  from: Point,
  to: Point,
  size: number,
}

function Segment(props: SegmentProps) {
  const { from, to, size } = props;
  const width = (Math.abs(from.x - to.x) + 1) * size;
  const height = (Math.abs(from.y - to.y) + 1) * size;
  const style = {
    top: Math.min(from.y, to.y) * size + 'px',
    left: Math.min(from.x, to.x) * size + 'px',
    position: 'absolute'
  } as React.CSSProperties;
  return (
    <div className="fm-snake-snake__segment" style={style}>
      <svg width="100%" height="100%" >
        <rect width={width} height={height} className="fm-snake-snake__skin" />
      </svg>
    </div>
  );
}

export type SnakeProps = {
  chain: Point[],
  size: number,
}

/**
 * The snake.
 */
export default function Snake(props: SnakeProps) {
  const { chain, size } = props;
  const segments = getSegments(chain);
  return (
    <React.Fragment>
      {segments.map((segment) => <Segment from={segment[0]} to={segment[1]} size={size} />)}
    </React.Fragment>
  );
}