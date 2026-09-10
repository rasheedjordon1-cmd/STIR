import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import s from './ui.module.css'

type Variant = 'primary' | 'secondary' | 'quiet'

const variants: Record<Variant, string> = {
  primary: s.btnPrimary,
  secondary: s.btnSecondary,
  quiet: s.btnQuiet,
}

function cls(variant: Variant, o: { block?: boolean; lg?: boolean; cut?: boolean; extra?: string }) {
  return [
    s.btn,
    variants[variant],
    o.block ? s.btnBlock : '',
    o.lg ? s.btnLg : '',
    o.cut && variant !== 'quiet' ? s.btnCut : '',
    o.extra,
  ]
    .filter(Boolean)
    .join(' ')
}

export function Button({
  variant = 'primary',
  block,
  lg,
  cut,
  className,
  children,
  ...rest
}: {
  variant?: Variant
  block?: boolean
  lg?: boolean
  cut?: boolean
  children: ReactNode
} & ComponentProps<'button'>) {
  return (
    <button className={cls(variant, { block, lg, cut, extra: className })} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({
  href,
  variant = 'primary',
  block,
  lg,
  cut,
  className,
  children,
  ...rest
}: {
  href: string
  variant?: Variant
  block?: boolean
  lg?: boolean
  cut?: boolean
  children: ReactNode
} & Omit<ComponentProps<typeof Link>, 'href'>) {
  return (
    <Link href={href} className={cls(variant, { block, lg, cut, extra: className })} {...rest}>
      {children}
    </Link>
  )
}

export const quietMark = s.quietMark
