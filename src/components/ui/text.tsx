import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import styles from "./text.module.css"

type TextSize = "body-lg" | "body-md" | "body-sm" | "label-lg" | "label-md" | "label-sm"

type TextTone = "default" | "muted" | "on-container" | "error" | "success"

type TextProps = {
  as?: ElementType
  size?: TextSize
  tone?: TextTone
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<"p">, "children">

export function Text({
  as: Tag = "p",
  size = "body-md",
  tone = "default",
  children,
  className,
  ...props
}: TextProps) {
  return (
    <Tag className={`${styles.root} ${styles[size]} ${styles[tone]} ${className ?? ""}`} {...props}>
      {children}
    </Tag>
  )
}
