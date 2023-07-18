import React, { useMemo } from "react";
import { BarTask } from "../../types/bar-task";
import { ColumnOption, Task } from "../../types/public-types";
import styles from './task-list.module.css';
import {defaultDateTimeOptions, toLocaleDateStringFactory} from '../../helpers/date-helper';

export type TaskListProps = {
  headerHeight: number;
  fontFamily: string;
  fontSize: string;
  rowHeight: number;
  ganttHeight: number;
  stickyTable: boolean;
  locale: string;
  tasks: Task[];
  taskListRef: React.RefObject<HTMLTableElement>;
  horizontalContainerClass?: string;
  selectedTask: BarTask | undefined;
  setSelectedTask: (task: string) => void;
  onExpanderClick: (task: Task) => void;
  TaskListHeader: React.FC<{
    headerHeight: number;
    fontFamily: string;
    fontSize: string;
    columns: ColumnOption[];
  }>;
  TaskListTable: React.FC<{
    rowHeight: number;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
    columns: ColumnOption[];
  }>;
  columns?: ColumnOption[];
  taskListCustomClass?: string;
};

export const TaskList: React.FC<TaskListProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
  rowHeight,
  tasks,
  selectedTask,
  setSelectedTask,
  onExpanderClick,
  locale,
  ganttHeight,
  stickyTable,
  taskListRef,
  // horizontalContainerClass,
  TaskListHeader,
  TaskListTable,
  columns,
  taskListCustomClass,
}) => {
  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(locale),
    [locale]
  );

  const dateCustomRender = (value: Date) => toLocaleDateString(value, defaultDateTimeOptions);

  const cols: ColumnOption[] = columns ?? [
    { header: "Name", dataPath: "name" },
    { header: "From", dataPath: "start", customRender: dateCustomRender },
    { header: "To", dataPath: "end", customRender: dateCustomRender },
  ] as ColumnOption[];

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    columns: cols,
  };
  const selectedTaskId = selectedTask ? selectedTask.id : "";
  const tableProps = {
    rowHeight,
    fontFamily,
    fontSize,
    tasks,
    locale,
    selectedTaskId: selectedTaskId,
    setSelectedTask,
    onExpanderClick,
    columns: cols,
  };
  
  return (
    <table
      ref={taskListRef}
      className={`${styles.taskListTable} ${stickyTable && styles.sticky} ${taskListCustomClass ?? ''}`}
      style={{ "--gantt-height": ganttHeight ? `${ganttHeight}px` : "unset" } as React.CSSProperties}
    >
      <TaskListHeader {...headerProps} />
      <TaskListTable {...tableProps} />
    </table>
  );
};
