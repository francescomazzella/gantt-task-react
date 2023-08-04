import React from "react";
import styles from "./task-list-table.module.css";
import { TaskListTable } from "../../types/public-types";

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
        {tasks.map(t => {

          let expanderSymbol = "";
          if (t.hideChildren === false) {
            expanderSymbol = "▼";
          } else if (t.hideChildren === true) {
            expanderSymbol = "▶";
          }

          return (
            <tr
              className={styles.taskRow}
              key={`${t.id}row`}
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
                    onClick={() => onExpanderClick(t)}
                  >
                    {expanderSymbol}
                  </div>
                </div>
              </td>

              {columns?.map(col => {
                const value = col.dataPath.split('.').reduce((a, b) => a ? a[b] : null, t as any);
                const style = col.style ?? {};
                if (col.width) style.width = col.width;
                return (
                  <td
                    key={`${t.id} ${col.header}`}
                    className={styles.cell}
                    style={style}
                    title={value && String(value)}
                  >
                    {col.customRender ? col.customRender(value) : value}
                  </td>
                )
              })}
            </tr>
          );
        })}
      </tbody>
    );
  };
