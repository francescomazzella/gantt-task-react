import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Task, TooltipContent } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import { defaultDateTimeOptions, toLocaleDateStringFactory } from '../../helpers/date-helper';
import styles from "./tooltip.module.css";

const Y_OFFSET = 20;

export type TooltipProps = {
  task: BarTask;
  arrowIndent: number;
  locale: string;
  rtl: boolean;
  svgContainerHeight: number;
  svgContainerWidth: number;
  svgWidth: number;
  headerHeight: number;
  taskListWidth: number;
  rowHeight: number;
  fontSize: string;
  fontFamily: string;
  TooltipContent: TooltipContent;
};
export const Tooltip: React.FC<TooltipProps> = ({
  task,
  rowHeight,
  locale,
  rtl,
  svgContainerHeight,
  svgContainerWidth,
  arrowIndent,
  fontSize,
  fontFamily,
  headerHeight,
  taskListWidth,
  TooltipContent,
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);
  useEffect(() => {
    const handleWindowMouseMove: (this: Window, ev: MouseEvent) => any = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };
    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!tooltipRef.current || mousePosition === null) return;

    const tooltipWidth = tooltipRef.current.offsetWidth;
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const windowWidth = window.innerWidth - 20;
    const windowHeight = window.innerHeight - 20;

    // Calculate the position for the tooltip, keeping it inside the window boundaries
    let x = mousePosition.x - tooltipWidth / 2;
    let y = mousePosition.y + Y_OFFSET;

    // Adjust tooltip position if it's too close to the right or left edge
    if (x < 0) {
      x = 0;
    } else if (x + tooltipWidth > windowWidth) {
      x = windowWidth - tooltipWidth;
    }

    // Adjust tooltip position if it's too close to the bottom or top edge
    if (y + tooltipHeight > windowHeight) {
      y = mousePosition.y - tooltipHeight - Y_OFFSET;
    }

    setTooltipPosition(() => {
      return { x, y };
    });
  }, [
    tooltipRef,
    task,
    arrowIndent,
    mousePosition,
    headerHeight,
    taskListWidth,
    rowHeight,
    svgContainerHeight,
    svgContainerWidth,
    rtl,
  ]);

  if (mousePosition === null) return null;
  return (
    <div
      ref={tooltipRef}
      className={styles.tooltipContainer}
      style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
      }}
    >
      <TooltipContent task={task} fontSize={fontSize} fontFamily={fontFamily} locale={locale} />
    </div>
  );
};

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
  locale: string;
}> = ({ task, fontSize, fontFamily, locale }) => {
  const style = {
    fontSize,
    fontFamily,
  };

  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(locale),
    [locale]
  );

  return (
    <div className={styles.tooltipDefaultContainer} style={style}>
      <strong style={{ fontSize: parseInt(fontSize) + 6 }}>{`${task.name}`}</strong>

      {task.end.getTime() - task.start.getTime() !== 0 && (
        <span className={styles.tooltipDefaultContainerParagraph}>
          <span><br />{`${toLocaleDateString(task.start, defaultDateTimeOptions)} - ${toLocaleDateString(task.end, defaultDateTimeOptions)} (${formatDuration(task.start, task.end)})`}</span>
          {!!task.progress && <span><span className={styles.tooltipDefaultContainerParagraph}>Progress: {task.progress}%</span></span>}
        </span>
      )}

    </div>
  );
};

const formatDuration = (startDate: Date, endDate: Date) => {
  const durationInMilliseconds = endDate.getTime() - startDate.getTime();
  const durationInDays = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));
  return `${durationInDays} ${durationInDays === 1 ? 'day' : 'days'}`;
};
