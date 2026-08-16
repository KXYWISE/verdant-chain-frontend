import type { ComponentPropsWithoutRef } from "react"
import styles from "./spinner.module.css"

type SpinnerSize = "sm" | "md" | "lg"

type SpinnerProps = {
  size?: SpinnerSize
  label?: string
} & Omit<ComponentPropsWithoutRef<"div">, "children">

export function Spinner({ size = "md", label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`${styles.root} ${styles[size]} ${className ?? ""}`}
      {...props}
    >
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.visuallyHidden}>{label}</span>
    </div>
  )
}
