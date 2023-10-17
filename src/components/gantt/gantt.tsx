import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { ViewMode, GanttProps, Task } from "../../types/public-types";
import { GridProps } from "../grid/grid";
import { ganttDateRange, seedDates } from "../../helpers/date-helper";
import { CalendarProps } from "../calendar/calendar";
import { TaskGanttContentProps } from "./task-gantt-content";
import { TaskListHeaderDefault } from "../task-list/task-list-header";
import { TaskListTableDefault } from "../task-list/task-list-table";
import { StandardTooltipContent, Tooltip } from "../other/tooltip";
import { TaskListProps, TaskList } from "../task-list/task-list";
import { TaskGantt } from "./task-gantt";
import { BarTask } from "../../types/bar-task";
import { convertToBarTasks } from "../../helpers/bar-helper";
import { GanttEvent } from "../../types/gantt-task-actions";
import { DateSetup } from "../../types/date-setup";
import { removeHiddenTasks, sortTasks } from "../../helpers/other-helper";
import { NoData } from "../other/no-data";
import styles from "./gantt.module.css";

export const Gantt: React.FunctionComponent<GanttProps> = ({
  tasks,
  headerHeight = 50,
  columnWidth = 60,
  rowHeight = 50,
  ganttHeight = 0,
  stickyTable = false,
  hideTable = false,
  showNames = true,
  showTooltip = true,
  viewMode = ViewMode.Day,
  preStepsCount = 1,
  locale = "en-GB",
  barFill = 60,
  barCornerRadius = 3,
  barProgressColor = "#a3a3ff",
  barProgressSelectedColor = "#8282f5",
  barBackgroundColor = "#b8c2cc",
  barBackgroundSelectedColor = "#aeb8c2",
  projectProgressColor = "#7db59a",
  projectProgressSelectedColor = "#59a985",
  projectBackgroundColor = "#fac465",
  projectBackgroundSelectedColor = "#f7bb53",
  milestoneBackgroundColor = "#f1c453",
  milestoneBackgroundSelectedColor = "#f29e4c",
  rtl = false,
  handleWidth = 8,
  timeStep = 300000,
  arrowColor = "grey",
  fontFamily = "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue",
  fontSize = "14px",
  arrowIndent = 20,
  todayColor = "rgba(252, 248, 227, 0.5)",
  showBorderOnSelection = true,
  animateSelectedArrows = true,
  viewDate,
  TooltipContent = StandardTooltipContent,
  TaskListHeader = TaskListHeaderDefault,
  TaskListTable = TaskListTableDefault,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
  onSelect,
  onSelectionChange,
  onExpanderClick,
  columns,
  containerCustomClass,
  taskListCustomClass,
  ganttCustomClass,
  multiselection = false,
  selectedTasks: initialSelectedTasks = undefined,
  NoDataContent = NoData,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLTableElement>(null);
  const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
    const [startDate, endDate] = ganttDateRange(tasks, viewMode, preStepsCount);
    return { viewMode, dates: seedDates(startDate, endDate, viewMode) };
  });
  const [currentViewDate, setCurrentViewDate] = useState<Date | undefined>(
    undefined
  );

  const [taskListWidth, setTaskListWidth] = useState(0);
  const [svgContainerWidth, setSvgContainerWidth] = useState(0);
  const [svgContainerHeight, setSvgContainerHeight] = useState(ganttHeight);
  const [barTasks, setBarTasks] = useState<BarTask[]>([]);
  const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
    action: "",
  });
  const taskHeight = useMemo(
    () => (rowHeight * barFill) / 100,
    [rowHeight, barFill]
  );

  const selectedTasksState = (initialSelectedTasks?.map((s: string | Task) => (typeof s === 'string') ? tasks.find(t => t.id === s) : s).filter(t => t) ?? []) as BarTask[];

  const [activeTask, setActiveTask] = useState<BarTask>();
  const [selectedTasks, setSelectedTasks] = useState<BarTask[]>(selectedTasksState);
  const [failedTask, setFailedTask] = useState<BarTask | null>(null);

  const [showTooltipOverride, setShowTooltipOverride] = useState(false);

  useEffect(() => {
    onSelectionChange?.(selectedTasks, activeTask);
  }, [selectedTasks]);

  useEffect(() => {
    activeTask && onSelect?.(activeTask, true);
    return () => activeTask && onSelect?.(activeTask, false);
  }, [activeTask]);

  const svgWidth = dateSetup.dates.length * columnWidth;

  // task change events
  useEffect(() => {
    let filteredTasks: Task[];
    if (onExpanderClick) {
      filteredTasks = removeHiddenTasks(tasks);
    } else {
      filteredTasks = tasks;
    }
    filteredTasks = filteredTasks.sort(sortTasks);
    const [startDate, endDate] = ganttDateRange(
      filteredTasks,
      viewMode,
      preStepsCount
    );
    let newDates = seedDates(startDate, endDate, viewMode);
    if (rtl) {
      newDates = newDates.reverse();
    }
    setDateSetup({ dates: newDates, viewMode });
    setBarTasks(
      convertToBarTasks(
        filteredTasks,
        newDates,
        {
          columnWidth,
          rowHeight,
          taskHeight,
          barCornerRadius,
          handleWidth,
          rtl,
          barProgressColor,
          barProgressSelectedColor,
          barBackgroundColor,
          barBackgroundSelectedColor,
          projectProgressColor,
          projectProgressSelectedColor,
          projectBackgroundColor,
          projectBackgroundSelectedColor,
          milestoneBackgroundColor,
          milestoneBackgroundSelectedColor,
        }
      )
    );
  }, [
    tasks,
    viewMode,
    preStepsCount,
    rowHeight,
    barCornerRadius,
    columnWidth,
    taskHeight,
    handleWidth,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    projectProgressColor,
    projectProgressSelectedColor,
    projectBackgroundColor,
    projectBackgroundSelectedColor,
    milestoneBackgroundColor,
    milestoneBackgroundSelectedColor,
    rtl,
    onExpanderClick,
  ]);

  useEffect(() => {
    if (
      viewMode === dateSetup.viewMode &&
      ((viewDate && !currentViewDate) ||
        (viewDate && currentViewDate?.valueOf() !== viewDate.valueOf()))
    ) {
      const dates = dateSetup.dates;
      const index = dates.findIndex(
        (d, i) =>
          viewDate.valueOf() >= d.valueOf() &&
          i + 1 !== dates.length &&
          viewDate.valueOf() < dates[i + 1].valueOf()
      );
      if (index === -1) {
        return;
      }
      setCurrentViewDate(viewDate);
    }
  }, [
    viewDate,
    columnWidth,
    dateSetup.dates,
    dateSetup.viewMode,
    viewMode,
    currentViewDate,
    setCurrentViewDate,
  ]);

  useEffect(() => {
    const { changedTask, action } = ganttEvent;
    if (changedTask) {
      if (action === "delete") {
        setGanttEvent({ action: "" });
        setBarTasks(barTasks.filter(t => t.id !== changedTask.id));
      } else if (
        action === "move" ||
        action === "end" ||
        action === "start" ||
        action === "progress"
      ) {
        if (showTooltip === "onChange" && action !== "progress") {
          setShowTooltipOverride(true);
        }
        const prevStateTask = barTasks.find(t => t.id === changedTask.id);
        if (
          prevStateTask &&
          (prevStateTask.start!.getTime() !== changedTask.start!.getTime() ||
            prevStateTask.end!.getTime() !== changedTask.end!.getTime() ||
            prevStateTask.progress !== changedTask.progress)
        ) {
          // actions for change
          const newTaskList = barTasks.map(t =>
            t.id === changedTask.id ? changedTask : t
          );
          setBarTasks(newTaskList);
        }
      }
    } else if (action === "") {
      setShowTooltipOverride(false);
    }
  }, [ganttEvent, barTasks, showTooltip]);

  useEffect(() => {
    if (failedTask) {
      setBarTasks(barTasks.map(t => (t.id !== failedTask.id ? t : failedTask)));
      setFailedTask(null);
    }
  }, [failedTask, barTasks]);

  useEffect(() => {
    if (taskListRef.current) {
      setTaskListWidth(taskListRef.current.offsetWidth);
    }
  }, [taskListRef, columns]);

  useEffect(() => {
    if (wrapperRef.current) {
      setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth);
    }
  }, [wrapperRef, taskListWidth]);

  useEffect(() => {
    if (ganttHeight) {
      setSvgContainerHeight(ganttHeight + headerHeight);
    } else {
      setSvgContainerHeight(tasks.length * rowHeight + headerHeight);
    }
  }, [ganttHeight, tasks, headerHeight, rowHeight]);

  const handleTaskSelection = (taskId?: string, ctrlKey?: boolean, shiftKey?: boolean) => {
    const clickedTask = barTasks.find(t => t.id === taskId);
    if (!clickedTask) {
      setSelectedTasks([]);
      setActiveTask(undefined);
      return;
    }
    onClick?.(clickedTask);
    if (!multiselection) {
      setSelectedTasks([clickedTask]);
      setActiveTask(clickedTask);
      return;
    }
    if (!ctrlKey && !shiftKey) {
      setSelectedTasks([clickedTask]);
      setActiveTask(clickedTask);
      return;
    }
    if ((!shiftKey && ctrlKey) || (shiftKey && !activeTask)) {
      if (!selectedTasks.some(st => st.id === clickedTask.id)) {
        setSelectedTasks([...selectedTasks, clickedTask]);
        setActiveTask(clickedTask);
      } else {
        const newSelectedTasks = [...selectedTasks];
        newSelectedTasks.splice(selectedTasks.findIndex(st => st.id === clickedTask.id), 1);
        setSelectedTasks(newSelectedTasks);
      }
      return;
    }
    if (shiftKey) {
      if (!activeTask) return;
      const fromIndex = barTasks.findIndex(t => t.id === activeTask.id);
      const toIndex = barTasks.findIndex(t => t.id === clickedTask.id);
      const tasksToAdd = barTasks.slice(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex) + 1);
      const newSelectedTasks: BarTask[] = [...selectedTasks];
      tasksToAdd.forEach(nt => {
        if (newSelectedTasks.some(st => st.id === nt.id)) return;
        newSelectedTasks.push(nt);
      })
      setSelectedTasks(newSelectedTasks);
      setActiveTask(clickedTask);
    }
  };

  const handleExpanderClick = (task: Task) => {
    if (onExpanderClick && task.hideChildren !== undefined) {
      onExpanderClick({ ...task, hideChildren: !task.hideChildren });
    }
  };
  const gridProps: GridProps = {
    columnWidth,
    svgWidth,
    tasks: tasks,
    rowHeight,
    dates: dateSetup.dates,
    todayColor,
    rtl,
  };
  const calendarProps: CalendarProps = {
    dateSetup,
    locale,
    viewMode,
    headerHeight,
    columnWidth,
    fontFamily,
    fontSize,
    rtl,
  };
  const barProps: TaskGanttContentProps = {
    tasks: barTasks,
    dates: dateSetup.dates,
    ganttEvent,
    selectedTasks,
    rowHeight,
    taskHeight,
    columnWidth,
    arrowColor,
    timeStep,
    fontFamily,
    fontSize,
    arrowIndent,
    svgWidth,
    rtl,
    showNames,
    showBorderOnSelection,
    animateSelectedArrows,
    setGanttEvent,
    setFailedTask,
    onTaskSelection: handleTaskSelection,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onClick,
    onDelete,
  };

  const tableProps: TaskListProps = {
    rowHeight,
    stickyTable,
    fontFamily,
    fontSize,
    tasks: barTasks,
    locale,
    headerHeight,
    ganttHeight,
    horizontalContainerClass: styles.horizontalContainer,
    selectedTasks,
    taskListRef,
    onTaskSelection: handleTaskSelection,
    onExpanderClick: handleExpanderClick,
    TaskListHeader,
    TaskListTable,
    columns,
    taskListCustomClass,
  };

  const noDataProps = {
    fontFamily,
    fontSize,
    locale,
  };

  const actuallyShowTooltip = showTooltipOverride || (showTooltip === true || showTooltip === 'always');
  
  return (
    <div>
      <div
        className={`${styles.wrapper} ${containerCustomClass ?? ''}`}
        tabIndex={0}
        ref={wrapperRef}
      >
        {!hideTable && <TaskList {...tableProps} />}
        <TaskGantt
          gridProps={gridProps}
          calendarProps={calendarProps}
          barProps={barProps}
          ganttHeight={ganttHeight}
          customClass={ganttCustomClass}
          animateSelectedArrows={animateSelectedArrows}
        />
        {actuallyShowTooltip && ganttEvent.changedTask && (
          <Tooltip
            arrowIndent={arrowIndent}
            rowHeight={rowHeight}
            svgContainerHeight={svgContainerHeight}
            svgContainerWidth={svgContainerWidth}
            fontFamily={fontFamily}
            fontSize={fontSize}
            task={ganttEvent.changedTask}
            headerHeight={headerHeight}
            taskListWidth={taskListWidth}
            TooltipContent={TooltipContent}
            locale={locale}
            rtl={rtl}
            svgWidth={svgWidth}
            changing={ganttEvent.action === "move" || ganttEvent.action === "progress" || ganttEvent.action === "start" || ganttEvent.action === "end"}
          />
        )}
      </div>
      {tasks.length === 0 && <NoDataContent {...noDataProps} />}
    </div>
  );
};
