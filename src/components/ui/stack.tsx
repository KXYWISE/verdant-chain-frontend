import type { ComponentPropsWithoutRef, ElementType } from "react"
import styles from "./stack.module.css"

type StackProps = {
  as?: ElementType
  /** Base direction; flips to horizontal inside containers >= cq-md */
  responsive?: boolean
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8
  wrap?: boolean
} & Omit<ComponentPropsWithoutRef<"div">, "gap">

const gapClass: Record<NonNullable<StackProps["gap"]>, string> = {
  1: styles.gap1,
  2: styles.gap2,
  3: styles.gap3,
  4: styles.gap4,
  5: styles.gap5,
  6: styles.gap6,
  8: styles.gap8,
}

export function Stack({
  as: Tag = "div",
  responsive = false,
  gap = 4,
  wrap = false,
  className,
  ...props
}: StackProps) {
  const classNames = [
    styles.root,
    gapClass[gap],
    responsive ? styles.responsive : "",
    wrap ? styles.wrap : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")
  return <Tag className={classNames} {...props} />
}
