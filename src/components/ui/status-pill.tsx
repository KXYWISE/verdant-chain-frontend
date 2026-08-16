import type { ComponentPropsWithoutRef } from "react"
import styles from "./status-pill.module.css"

export type StatusTone = "success" | "pending" | "error" | "info" | "neutral"

type StatusPillProps = {
  tone?: StatusTone
  label: string
  dot?: boolean
} & Omit<ComponentPropsWithoutRef<"span">, "children">

export function StatusPill({
  tone = "neutral",
  label,
  dot = true,
  className,
  ...props
}: StatusPillProps) {
  return (
    <span className={`${styles.root} ${styles[tone]} ${className ?? ""}`} {...props}>
      {dot ? <span className={styles.dot} aria-hidden="true" /> : null}
      {label}
    </span>
  )
}
