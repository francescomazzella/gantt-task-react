import React, { useEffect, useState } from "react";
import { EventOption } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import { Arrow } from "../other/arrow";
import { handleTaskBySVGMouseEvent } from "../../helpers/bar-helper";
import { isKeyboardEvent } from "../../helpers/other-helper";
import { TaskItem } from "../task-item/task-item";
import {
  BarMoveAction,
  GanttContentMoveAction,
  GanttEvent,
} from "../../types/gantt-task-actions";

import styles from "./task-gantt-content.module.css";

export type TaskGanttContentProps = {
  tasks: BarTask[];
  dates: Date[];
  ganttEvent: GanttEvent;
  selectedTasks: BarTask[];
  rowHeight: number;
  columnWidth: number;
  timeStep: number;
  svg?: React.RefObject<SVGSVGElement>;
  svgWidth: number;
  taskHeight: number;
  arrowColor: string;
  arrowIndent: number;
  fontSize: string;
  fontFamily: string;
  rtl: boolean;
  showNames: boolean;
  showBorderOnSelection: boolean;
  animateSelectedArrows?: boolean;
  setGanttEvent: (value: GanttEvent) => void;
  setFailedTask: (value: BarTask | null) => void;
  onTaskSelection: (taskId?: string, ctrlKey?: boolean, shiftKey?: boolean) => void;
} & EventOption;

export const TaskGanttContent: React.FC<TaskGanttContentProps> = ({
  tasks,
  dates,
  ganttEvent,
  selectedTasks,
  rowHeight,
  columnWidth,
  timeStep,
  svg,
  taskHeight,
  arrowColor,
  arrowIndent,
  fontFamily,
  fontSize,
  rtl,
  showNames,
  showBorderOnSelection,
  animateSelectedArrows,
  setGanttEvent,
  setFailedTask,
  onTaskSelection,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
}) => {
  const point = svg?.current?.createSVGPoint();
  const [xStep, setXStep] = useState(0);
  const [initEventX1Delta, setInitEventX1Delta] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!ganttEvent.action && !(event.target as HTMLElement).classList.contains('task')) onTaskSelection();
    };
    const currentSVG = svg?.current;
    currentSVG?.addEventListener("mousedown", handleMouseDown, { passive: true });
    return () => {
      currentSVG?.removeEventListener("mousedown", handleMouseDown);
    };
  });

  // create xStep
  useEffect(() => {
    const dateDelta =
      dates[1].getTime() -
      dates[0].getTime() -
      dates[1].getTimezoneOffset() * 60 * 1000 +
      dates[0].getTimezoneOffset() * 60 * 1000;
    const newXStep = (timeStep * columnWidth) / dateDelta;
    setXStep(newXStep);
  }, [columnWidth, dates, timeStep]);

  useEffect(() => {
    const handleMouseMove = async (event: MouseEvent) => {
      if (!ganttEvent.changedTask || !point || !svg?.current) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );

      const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        ganttEvent.action as BarMoveAction,
        ganttEvent.changedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      );
      if (isChanged) {
        setGanttEvent({ action: ganttEvent.action, changedTask });
      }
    };

    const handleMouseUp = async (event: MouseEvent) => {
      const { action, originalSelectedTask, changedTask } = ganttEvent;
      if (!changedTask || !point || !svg?.current || !originalSelectedTask)
        return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );
      const { changedTask: newChangedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        action as BarMoveAction,
        changedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      );

      const isNotLikeOriginal =
        originalSelectedTask.start !== newChangedTask.start ||
        originalSelectedTask.end !== newChangedTask.end ||
        originalSelectedTask.progress !== newChangedTask.progress;

      // remove listeners
      svg.current.removeEventListener("mousemove", handleMouseMove);
      svg.current.removeEventListener("mouseup", handleMouseUp);
      setGanttEvent({ action: "" });
      setIsMoving(false);

      // custom operation start
      let operationSuccess = true;
      if (
        (action === "move" || action === "end" || action === "start") &&
        onDateChange &&
        isNotLikeOriginal
      ) {
        try {
          const result = await onDateChange(
            newChangedTask,
            newChangedTask.barChildren.map(c => c.barTask)
          );
          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          operationSuccess = false;
        }
      } else if (onProgressChange && isNotLikeOriginal) {
        try {
          const result = await onProgressChange(
            newChangedTask,
            newChangedTask.barChildren.map(c => c.barTask)
          );
          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          operationSuccess = false;
        }
      }

      // If operation is failed - return old state
      if (!operationSuccess) {
        setFailedTask(originalSelectedTask);
      }
    };

    if (
      !isMoving &&
      (ganttEvent.action === "move" ||
        ganttEvent.action === "end" ||
        ganttEvent.action === "start" ||
        ganttEvent.action === "progress") &&
      svg?.current
    ) {
      svg.current.addEventListener("mousemove", handleMouseMove);
      svg.current.addEventListener("mouseup", handleMouseUp);
      setIsMoving(true);
    }
  }, [
    ganttEvent,
    xStep,
    initEventX1Delta,
    onProgressChange,
    timeStep,
    onDateChange,
    svg,
    isMoving,
    point,
    rtl,
    setFailedTask,
    setGanttEvent,
  ]);

  /**
   * Method is Start point of task change
   */
  const handleBarEventStart = async (
    action: GanttContentMoveAction,
    task: BarTask,
    event: React.MouseEvent | React.KeyboardEvent
  ) => {
    // Keyboard events
    if (isKeyboardEvent(event)) {
      if (action === "delete") {
        if (onDelete) {
          try {
            const result = await onDelete(task);
            if (result !== undefined && result) {
              setGanttEvent({ action, changedTask: task });
            }
          } catch (error) {
            console.error("Error on Delete. " + error);
          }
        }
      }
    }
    // Mouse Events
    else if (action === "mouseenter") {
      if (!ganttEvent.action) {
        setGanttEvent({
          action,
          changedTask: task,
          originalSelectedTask: task,
        });
      }
    } else if (action === "mouseleave") {
      if (ganttEvent.action === "mouseenter") {
        setGanttEvent({ action: "" });
      }
    } else if (action === "dblclick") {
      !!onDoubleClick && onDoubleClick(task);
    } else if (action === "click") {
      onTaskSelection(task.id, event.ctrlKey, event.shiftKey);
      !!onClick && onClick(task);
    }
    // Change task event start
    else if (action === "move") {
      if (!svg?.current || !point) return;
      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg.current.getScreenCTM()?.inverse()
      );
      setInitEventX1Delta(cursor.x - task.x1!);
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    } else {
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    }
  };

  type ArrowInfo = {
    taskFrom: BarTask;
    taskTo: BarTask;
    color: string | undefined;
  };

  const selectedArrows: ArrowInfo[] = [];
  const notSelectedArrows: ArrowInfo[] = [];

  tasks.forEach(task => {
    if (task.typeInternal === "hidden") return;
    task.barChildren.forEach(({ color, barTask: child }) => {
      if (child.typeInternal === "hidden") return;
      const arrowInfo = {
        taskFrom: task,
        taskTo: tasks[child.index],
        color: color,
      };
      if (selectedTasks.some(st => st.id === child.id || st.id === task.id)) {
        selectedArrows.push(arrowInfo);
      } else {
        notSelectedArrows.push(arrowInfo);
      }
    });
  });

  const isAnyArrowSelected = selectedArrows.length > 0;

  return (
    <g className="content">
      <g className="arrows" fill={arrowColor} stroke={arrowColor} opacity={isAnyArrowSelected ? 0.2 : 1}>
        {notSelectedArrows.map(({ taskFrom, taskTo, color }) => {
          return (
            <Arrow
              key={`Arrow from ${taskFrom.id} to ${taskTo.id}`}
              taskFrom={taskFrom}
              taskTo={taskTo}
              rowHeight={rowHeight}
              taskHeight={taskHeight}
              arrowIndent={arrowIndent}
              rtl={rtl}
              color={color}
            />
          );
        })}
      </g>
      {isAnyArrowSelected && <g className={`arrows ${animateSelectedArrows ? styles.selected : ''}`} fill={arrowColor} stroke={arrowColor}>
        {selectedArrows.map(({ taskFrom, taskTo, color }) => {
          return (
            <Arrow
              key={`Arrow from ${taskFrom.id} to ${taskTo.id}`}
              taskFrom={taskFrom}
              taskTo={taskTo}
              rowHeight={rowHeight}
              taskHeight={taskHeight}
              arrowIndent={arrowIndent}
              rtl={rtl}
              color={color}
            />
          );
        })}
      </g>}
      <g className="bar" fontFamily={fontFamily} fontSize={fontSize}>
        {tasks.map(task => {
          return (
            <TaskItem
              task={task}
              arrowIndent={arrowIndent}
              taskHeight={taskHeight}
              isProgressChangeable={!!onProgressChange && !task.isDisabled}
              isDateChangeable={!!onDateChange && !task.isDisabled}
              isDelete={!task.isDisabled}
              onEventStart={handleBarEventStart}
              key={task.id}
              isSelected={selectedTasks.some(st => st.id === task.id)}
              rtl={rtl}
              showName={showNames}
              showBorderOnSelection={showBorderOnSelection}
              isLocked={task.isLocked ?? false}
            />
          );
        })}
      </g>
    </g>
  );
};
