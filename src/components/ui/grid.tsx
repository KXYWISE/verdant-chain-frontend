import type { ComponentPropsWithoutRef, ElementType } from "react"
import styles from "./grid.module.css"

type GridProps = {
  as?: ElementType
  /** Columns at base; widens automatically inside containers >= cq-md/cq-lg */
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 2 | 3 | 4 | 5 | 6 | 8
  responsive?: boolean
} & Omit<ComponentPropsWithoutRef<"div">, "cols" | "gap">

const colsClass: Record<NonNullable<GridProps["cols"]>, string> = {
  1: styles.cols1,
  2: styles.cols2,
  3: styles.cols3,
  4: styles.cols4,
  6: styles.cols6,
  12: styles.cols12,
}

const gapClass: Record<NonNullable<GridProps["gap"]>, string> = {
  2: styles.gap2,
  3: styles.gap3,
  4: styles.gap4,
  5: styles.gap5,
  6: styles.gap6,
  8: styles.gap8,
}

export function Grid({
  as: Tag = "div",
  cols = 1,
  gap = 4,
  responsive = true,
  className,
  ...props
}: GridProps) {
  const classNames = [
    styles.root,
    colsClass[cols],
    gapClass[gap],
    responsive ? styles.responsive : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")
  return <Tag className={classNames} {...props} />
}
