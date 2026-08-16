import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import styles from "./heading.module.css"

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

type HeadingProps = {
  as?: ElementType
  size?: HeadingLevel
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<"h1">, "children">

export function Heading({ as: Tag = "h2", size, children, className, ...props }: HeadingProps) {
  const level = (size ?? defaultLevelFor(Tag)) as HeadingLevel
  return (
    <Tag className={`${styles.root} ${styles[`h${level}`]} ${className ?? ""}`} {...props}>
      {children}
    </Tag>
  )
}

function defaultLevelFor(tag: ElementType): HeadingLevel {
  const match = /^h([1-6])$/.exec(String(tag))
  return match ? (Number(match[1]) as HeadingLevel) : 2
}
