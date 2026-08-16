import type { ComponentPropsWithoutRef, ReactNode } from "react"
import styles from "./badge.module.css"

type BadgeProps = {
  children: ReactNode
  removable?: boolean
  onRemove?: () => void
} & Omit<ComponentPropsWithoutRef<"span">, "children">

export function Badge({ children, removable, onRemove, className, ...props }: BadgeProps) {
  return (
    <span className={`${styles.root} ${className ?? ""}`} {...props}>
      {children}
      {removable ? (
        <button type="button" className={styles.remove} aria-label="Remove" onClick={onRemove}>
          ×
        </button>
      ) : null}
    </span>
  )
}
