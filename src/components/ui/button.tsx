"use client"

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react"
import { Spinner } from "./spinner"
import styles from "./button.module.css"

type ButtonVariant = "filled" | "tonal" | "outlined" | "text"
type ButtonSize = "sm" | "md" | "lg"

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  /** Full-width inside narrow containers (container-query driven) */
  block?: boolean
  children?: ReactNode
}

type ButtonAsButton = CommonProps & { as?: "button" } & ButtonHTMLAttributes<HTMLButtonElement>
type ButtonAsAnchor = CommonProps & { as: "a" } & AnchorHTMLAttributes<HTMLAnchorElement>

type ButtonProps = ButtonAsButton | ButtonAsAnchor

export function Button(props: ButtonProps) {
  if (props.as === "a") {
    return <ButtonAnchor {...(props as ButtonAsAnchor)} />
  }
  return <ButtonElement {...(props as ButtonAsButton)} />
}

function classes({
  variant,
  size,
  block,
  className,
}: {
  variant: ButtonVariant
  size: ButtonSize
  block?: boolean
  className?: string
}) {
  return `${styles.root} ${styles[variant]} ${styles[size]} ${block ? styles.block : ""} ${
    className ?? ""
  }`
}

function ButtonElement({
  variant = "filled",
  size = "md",
  loading = false,
  leadingIcon,
  trailingIcon,
  children,
  className,
  disabled,
  block = false,
  ...props
}: ButtonAsButton) {
  const isDisabled = disabled || loading
  return (
    <button
      className={classes({ variant, size, block, className })}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  )
}

function ButtonAnchor({
  variant = "filled",
  size = "md",
  loading = false,
  leadingIcon,
  trailingIcon,
  children,
  className,
  block = false,
  ...props
}: ButtonAsAnchor) {
  return (
    <a className={classes({ variant, size, block, className })} {...props}>
      {loading ? <Spinner size="sm" /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </a>
  )
}
