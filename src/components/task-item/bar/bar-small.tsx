import React from "react";
import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";
import { BarDateHandle } from "./bar-date-handle";

export const BarSmall: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  isSelected,
  isLocked,
}) => {
  const progressPoint = getProgressPoint(
    task.progressWidth! + task.x1!,
    task.y,
    task.height
  );
  const handleHeight = task.height - 2;
  const handleWidth = task.handleWidth / 2;
  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        x={task.x1!}
        y={task.y}
        width={task.x2! - task.x1!}
        height={task.height}
        progressX={task.progressX!}
        progressWidth={task.progressWidth!}
        barCornerRadius={task.barCornerRadius}
        styles={task.styles}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      <g className="handleGroup">
        {isLocked && (
        <g className="lockedGroup">
          <rect
            x={task.x1}
            y={task.y}
            width={handleWidth}
            height={task.height}
            className={styles.barLockedHandle}
            ry={task.barCornerRadius}
            rx={task.barCornerRadius}
            fill={task.baseColor ?? 'black'}
          />
          <rect
            x={task.x2! - handleWidth}
            y={task.y}
            width={handleWidth}
            height={task.height}
            className={styles.barLockedHandle}
            ry={task.barCornerRadius}
            rx={task.barCornerRadius}
            fill={task.baseColor ?? 'black'}
          />
        </g>
      )}
        {isDateChangeable && (
          <g>
            {/* left */}
            <BarDateHandle
              x={task.x1! + 1}
              y={task.y + 1}
              width={handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("start", task, e);
              }}
            />
            {/* right */}
            <BarDateHandle
              x={task.x2! - handleWidth - 1}
              y={task.y + 1}
              width={handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("end", task, e);
              }}
            />
          </g>
        )}
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart("progress", task, e);
            }}
          />
        )}
      </g>
    </g>
  );
};
