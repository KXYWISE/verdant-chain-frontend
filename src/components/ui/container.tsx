import type { ElementType, ComponentPropsWithoutRef } from "react"
import styles from "./container.module.css"

type ContainerSize = "sm" | "md" | "lg" | "xl"

type ContainerProps = {
  as?: ElementType
  /** Fluid container width (`clamp` between container sizes) */
  fluid?: boolean
  /** Establish an inline-size containment context for responsive children */
  container?: boolean
  size?: ContainerSize
} & Omit<ComponentPropsWithoutRef<"div">, "size">

const sizeClass: Record<ContainerSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
}

export function Container({
  as: Tag = "div",
  fluid = true,
  container = false,
  size = "lg",
  className,
  ...props
}: ContainerProps) {
  const classNames = [
    styles.root,
    fluid ? styles.fluid : sizeClass[size],
    container ? styles.context : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")
  return <Tag className={classNames} {...props} />
}
