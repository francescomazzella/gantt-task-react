import React from "react";
import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";

export const Bar: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  rtl,
  onEventStart,
  isSelected,
  isLocked,
  showBorderOnSelection,
}) => {
  const progressPoint = getProgressPoint(
    +!rtl * task.progressWidth! + task.progressX!,
    task.y,
    task.height
  );
  const handleHeight = task.height - 2;
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
        baseColor={task.baseColor}
        showBorderOnSelection={showBorderOnSelection}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      {isLocked && (
        <g className="lockedGroup">
          <rect
            x={task.x1}
            y={task.y}
            width={task.handleWidth}
            height={task.height}
            className={styles.barLockedHandle}
            ry={task.barCornerRadius}
            rx={task.barCornerRadius}
            fill={task.baseColor ?? 'black'}
          />
          <rect
            x={task.x2! - task.handleWidth}
            y={task.y}
            width={task.handleWidth}
            height={task.height}
            className={styles.barLockedHandle}
            ry={task.barCornerRadius}
            rx={task.barCornerRadius}
            fill={task.baseColor ?? 'black'}
          />
        </g>
      )}
      <g className="handleGroup">
        {isDateChangeable && (
          <g>
            {/* left */}
            <BarDateHandle
              x={task.x1! + 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("start", task, e);
              }}
            />
            {/* right */}
            <BarDateHandle
              x={task.x2! - task.handleWidth - 1}
              y={task.y + 1}
              width={task.handleWidth}
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
