import { Task, TaskType } from "./public-types";

export interface BarTask extends Task {
  index: number;
  typeInternal: TaskTypeInternal;
  x1?: number;
  x2?: number;
  y: number;
  height: number;
  progressX?: number;
  progressWidth?: number;
  barCornerRadius: number;
  handleWidth: number;
  barChildren: BarChildInfo[];
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
}

export type BarChildInfo = {
  barTask: BarTask,
  color?: string,
}

export type TaskTypeInternal = TaskType | "smalltask" | "hidden";
