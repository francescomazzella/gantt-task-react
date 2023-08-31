export enum ViewMode {
  Hour = "Hour",
  QuarterDay = "Quarter Day",
  HalfDay = "Half Day",
  Day = "Day",
  /** ISO-8601 week */
  Week = "Week",
  Month = "Month",
  QuarterYear = "QuarterYear",
  Year = "Year",
}

export type TaskType = "task" | "milestone" | "project";

export type TaskDependency = { id: string, color?: string } | string

export interface Task<T = any> {
  id: string;
  type: TaskType;
  name: string;
  start: Date;
  end: Date;
  /**
   * From 0 to 100
   */
  progress?: number;
  baseColor?: string;
  styles?: {
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    progressColor?: string;
    progressSelectedColor?: string;
  };
  isDisabled?: boolean;
  isLocked?: boolean;
  project?: string;
  dependencies?: TaskDependency[];
  hideChildren?: boolean;
  displayOrder?: number;
  userData?: T;
}

export interface EventOption {
  /**
   * Time step value for date changes.
   */
  timeStep?: number;
  /**
   * Invokes on bar select or unselect.
   */
  onSelect?: (task: Task, isSelected: boolean) => void;
  /**
   * Invokes on bar selection.
   */
  onSelectionChange?: (tasks: Task[], activeTask?: Task) => void;
  /**
   * Invokes on bar double click.
   */
  onDoubleClick?: (task: Task) => void;
  /**
   * Invokes on bar click.
   */
  onClick?: (task: Task) => void;
  /**
   * Invokes on end and start time change. Chart undoes operation if method return false or error.
   */
  onDateChange?: (
    task: Task,
    children: Task[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on progress change. Chart undoes operation if method return false or error.
   */
  onProgressChange?: (
    task: Task,
    children: Task[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on delete selected task. Chart undoes operation if method return false or error.
   */
  onDelete?: (task: Task) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on expander on task list
   */
  onExpanderClick?: (task: Task) => void;
}

export interface DisplayOption {
  viewMode?: ViewMode;
  viewDate?: Date;
  preStepsCount?: number;
  /**
   * Specifies the month name language. Able formats: ISO 639-2, Java Locale
   */
  locale?: string;
  rtl?: boolean;
}

export interface StylingOption {
  headerHeight?: number;
  columnWidth?: number;
  rowHeight?: number;
  ganttHeight?: number;
  barCornerRadius?: number;
  handleWidth?: number;
  stickyTable?: boolean;
  hideTable?: boolean;
  showNames?: boolean;
  showTooltip?: boolean;
  fontFamily?: string;
  fontSize?: string;
  /**
   * How many of row width can be taken by task.
   * From 0 to 100
   */
  barFill?: number;
  barProgressColor?: string;
  barProgressSelectedColor?: string;
  barBackgroundColor?: string;
  barBackgroundSelectedColor?: string;
  projectProgressColor?: string;
  projectProgressSelectedColor?: string;
  projectBackgroundColor?: string;
  projectBackgroundSelectedColor?: string;
  milestoneBackgroundColor?: string;
  milestoneBackgroundSelectedColor?: string;
  arrowColor?: string;
  arrowIndent?: number;
  todayColor?: string;
  showBorderOnSelection?: boolean;
  containerCustomClass?: string;
  taskListCustomClass?: string;
  ganttCustomClass?: string;
  TooltipContent?: TooltipContent;
  TaskListHeader?: TaskListHeader;
  TaskListTable?: TaskListTable;
  NoDataContent?: React.FunctionComponent;
}

export type TooltipContent = React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
  locale: string;
}>;

export type TaskListHeader = React.FC<{
    headerHeight: number;
    fontFamily: string;
    fontSize: string;
    customClass?: string;
} & TableOption>;

export type TaskListTable = React.FC<{
  rowHeight: number;
  fontFamily: string;
  fontSize: string;
  customClass?: string;
  tasks: Task[];
  selectedTaskIds: string[];
  /**
   * Handle task selection by id
   */
  onTaskSelection: (taskId: string, ctrlKey: boolean, shiftKey: boolean) => void;
  onExpanderClick: (task: Task) => void;
} & TableOption>

export type NoDataContent = React.FC<{
  fontFamily: string;
  fontSize: string;
  locale: string;
  style?: React.CSSProperties;
}>;

export interface ColumnOption {
  header: string;
  dataPath: string;
  width?: string;
  style?: React.CSSProperties,
  headerStyle?: React.CSSProperties,
  customRender?: (value: any) => JSX.Element;
}

export interface TableOption {
  columns?: ColumnOption[];
}

export interface GanttProps extends EventOption, DisplayOption, StylingOption, TableOption {
  tasks: Task[];
  selectedTasks?: (string | Task)[];
  multiselection?: boolean;
}
