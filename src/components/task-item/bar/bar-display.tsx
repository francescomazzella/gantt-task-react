import React from "react";
import style from "./bar.module.css";

type BarDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  /* progress start point */
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  baseColor?: string;
  showBorderOnSelection?: boolean;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor?: string;
    progressColor: string;
    progressSelectedColor?: string;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export const BarDisplay: React.FC<BarDisplayProps> = ({
  x,
  y,
  width,
  height,
  isSelected,
  progressX,
  progressWidth,
  barCornerRadius,
  styles,
  onMouseDown,
  showBorderOnSelection,
  baseColor = 'black',
}) => {
  const getProcessColor = () => {
    return isSelected ? styles.progressSelectedColor ?? styles.progressColor : styles.progressColor;
  };

  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor  ?? styles.backgroundColor : styles.backgroundColor;
  };

  const getStroke = () => showBorderOnSelection && isSelected ? baseColor : undefined;
  const getStrokeWidth = () => showBorderOnSelection && isSelected ? 2 : 0;

  console.log(getStroke(), getStrokeWidth());

  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getBarColor()}
        stroke={getStroke()}
        strokeWidth={getStrokeWidth()}
        className={style.barBackground}
      />
      <rect
        x={progressX}
        width={progressWidth}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getProcessColor()}
      />
    </g>
  );
};
