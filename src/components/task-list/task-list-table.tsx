import React from "react";
import styles from "./task-list-table.module.css";
import { TaskListTable } from "../../types/public-types";

const getDataAtPath = (data: any, dataPath: string) => dataPath.split('.').reduce((a, b) => a ? a[b] : undefined, data);
const extractData = (data: any, dataPath: string | string[]) => {
  if (Array.isArray(dataPath)) {
    return dataPath.reduce((prev, current) => {
      return prev !== data && prev !== undefined ? prev : getDataAtPath(data, current)
    }, data);
  } else {
    return getDataAtPath(data, dataPath);
  }
}

export const TaskListTableDefault: TaskListTable = ({
  rowHeight,
  tasks,
  fontFamily,
  fontSize,
  onExpanderClick,
  columns,
}) => {
  return (
    <tbody
      className={styles.tableBody}
      style={{ fontFamily, fontSize }}
    >
      {tasks.map(task => {

        let expanderSymbol = "";
        if (task.hideChildren === false) {
          expanderSymbol = "▼";
        } else if (task.hideChildren === true) {
          expanderSymbol = "▶";
        }

        return (
          <tr
            className={styles.taskRow}
            key={`${task.id}row`}
            style={{ height: rowHeight, }}
          >
            <td className={`${styles.expanderCell} ${styles.cell}`}>
              <div className={styles.taskListNameWrapper}>
                <div
                  className={
                    expanderSymbol
                      ? styles.taskListExpander
                      : styles.taskListEmptyExpander
                  }
                  onClick={() => onExpanderClick(task)}
                >
                  {expanderSymbol}
                </div>
              </div>
            </td>

            {columns?.map(col => {
              const { dataPath, header, customRender } = col;
              const value = extractData(task, dataPath);
              const style = col.style ?? {};
              return (
                <td
                  key={`${task.id} ${header}`}
                  className={styles.cell}
                  style={style}
                  title={value && String(value)}
                >
                  {customRender ? customRender(value) : value}
                </td>
              )
            })}
          </tr>
        );
      })}
    </tbody>
  );
};
