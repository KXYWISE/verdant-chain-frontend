import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import styles from "./card.module.css"

type CardProps = {
  as?: ElementType
  elevation?: 0 | 1 | 2 | 3 | 4 | 5
  interactive?: boolean
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<"div">, "children">

export function Card({
  as: Tag = "div",
  elevation = 1,
  interactive = false,
  children,
  className,
  ...props
}: CardProps) {
  const classNames = [
    styles.root,
    styles[`elevation${elevation}`],
    interactive ? styles.interactive : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")
  return (
    <Tag className={classNames} {...props}>
      {children}
    </Tag>
  )
}
