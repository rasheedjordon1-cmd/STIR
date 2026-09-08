import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import s from './ui.module.css'

type Variant = 'solid' | 'outline' | 'quiet'

const variants: Record<Variant, string> = {
  solid: s.btnSolid,
  outline: s.btnOutline,
  quiet: s.btnQuiet,
}

function classes(variant: Variant, block?: boolean, size?: 'md' | 'lg', extra?: string) {
  return [s.btn, variants[variant], block ? s.btnBlock : '', size === 'lg' ? s.btnLg : '', extra]
    .filter(Boolean)
    .join(' ')
}

export function Button({
  variant = 'solid',
  block,
  size = 'md',
  className,
  children,
  ...rest
}: {
  variant?: Variant
  block?: boolean
  size?: 'md' | 'lg'
  children: ReactNode
} & ComponentProps<'button'>) {
  return (
    <button className={classes(variant, block, size, className)} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({
  href,
  variant = 'solid',
  block,
  size = 'md',
  className,
  children,
  ...rest
}: {
  href: string
  variant?: Variant
  block?: boolean
  size?: 'md' | 'lg'
  children: ReactNode
} & Omit<ComponentProps<typeof Link>, 'href'>) {
  return (
    <Link href={href} className={classes(variant, block, size, className)} {...rest}>
      {children}
    </Link>
  )
}
