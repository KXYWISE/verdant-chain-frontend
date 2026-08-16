"use client"

import { useId } from "react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import styles from "./input.module.css"

type InputProps = {
  label?: string
  hint?: string
  error?: string
  leadingIcon?: ReactNode
} & ComponentPropsWithoutRef<"input">

export function Input({
  label,
  hint,
  error,
  leadingIcon,
  className,
  id,
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const messageId = `${inputId}-message`
  const describedBy = error || hint ? messageId : undefined

  return (
    <div className={styles.field}>
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className={styles.control}>
        {leadingIcon ? <span className={styles.icon}>{leadingIcon}</span> : null}
        <input
          id={inputId}
          className={`${styles.input} ${error ? styles.invalid : ""} ${className ?? ""}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy ?? ariaDescribedBy}
          {...props}
        />
      </div>
      {error ? (
        <p id={messageId} className={styles.messageError} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className={styles.messageHint}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
