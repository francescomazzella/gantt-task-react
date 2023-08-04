import React from "react";
import styles from "./task-list-header.module.css";
import { TaskListHeader } from "../../types/public-types";

export const TaskListHeaderDefault: TaskListHeader = ({
  headerHeight,
  fontFamily,
  fontSize,
  columns,
}) => {
    return (
      <thead>
        <tr style={{
          height: headerHeight,
          fontFamily,
          fontSize
        }}>
          <th className={`${styles.expanderCell} ${styles.tableHeaderCell}`}></th>
          {columns?.map(col => {
            const style = col.headerStyle ?? {};
            if (col.width) style.width = col.width;
            return (
              <th
                key={col.header}
                className={styles.tableHeaderCell}
                style={style}
              >{col.header}</th>
            )
          })}
        </tr>
      </thead>
    );
  };
