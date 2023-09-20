import React, { useMemo } from "react";
import { BarTask } from "../../types/bar-task";
import { ColumnOption, Task, TaskListHeader, TaskListTable } from "../../types/public-types";
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
  selectedTasks: BarTask[];
  onTaskSelection: (taskId: string, ctrlKey: boolean, shiftKey: boolean) => void;
  onExpanderClick: (task: Task) => void;
  TaskListHeader: TaskListHeader;
  TaskListTable: TaskListTable;
  columns?: ColumnOption[];
  taskListCustomClass?: string;
};

export const TaskList: React.FC<TaskListProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
  rowHeight,
  tasks,
  selectedTasks,
  onTaskSelection,
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
  const selectedTaskIds = selectedTasks.map(t => t.id);
  const tableProps = {
    rowHeight,
    fontFamily,
    fontSize,
    tasks,
    locale,
    selectedTaskIds,
    onTaskSelection,
    onExpanderClick,
    columns: cols,
  };
  
  return (
    <table
      ref={taskListRef}
      className={`${styles.taskListTable} ${stickyTable && styles.sticky} ${taskListCustomClass ?? ''}`}
      style={{ "--gantt-height": ganttHeight ? `${ganttHeight}px` : "unset" } as React.CSSProperties}
    >
      <colgroup>
        <col style={{ width: 'min-content' }} />
        {cols.map((col) => {
          const style: React.CSSProperties = {};
          if (col.width) style.width = col.width;
          return <col key={`${col.dataPath}_${col.header}`} style={style} />;
        })}
      </colgroup>
      <TaskListHeader {...headerProps} />
      <TaskListTable {...tableProps} />
    </table>
  );
};
