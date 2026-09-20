'use client'

import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { commerce } from '@/content/commerce'
import { site } from '@/content/site'
import s from '@/components/sections/sections.module.css'

type State = 'idle' | 'sending' | 'done' | 'already' | 'error'

/**
 * SIGNUP — email capture with states that are true.
 *
 * ⚠ WHAT THIS REPLACED. The previous form did `e.preventDefault(); setDone(true)`
 *   and posted nowhere. It told every visitor "You are in" and dropped the
 *   address. That is worse than a broken form, because nobody reports it.
 *
 * Now: real validation, a sending state, a distinct already-subscribed state,
 * and a visible failure. When NEXT_PUBLIC_SIGNUP_URL is unset the form does not
 * render at all — better to show nothing than to collect addresses into a void.
 */
export function SignupForm() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')

  if (!commerce.signupUrl) return null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim()
    /* Belt and braces over the browser's type="email": a lone "a@b" passes
       native validation in some engines and is never a deliverable address. */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setState('error')
      return
    }
    setState('sending')
    try {
      const res = await fetch(commerce.signupUrl as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      })
      if (res.status === 409) setState('already')
      else if (res.ok) setState('done')
      else setState('error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <p className="t-lede" role="status">
        You’re in. We’ll send something when it’s worth opening.
      </p>
    )
  }
  if (state === 'already') {
    return (
      <p className="t-lede" role="status">
        You’re already on the list. Nothing more to do.
      </p>
    )
  }

  return (
    <form className={s.emailForm} onSubmit={submit} noValidate>
      <p className="t-lede" style={{ marginBottom: 'var(--s-3)' }}>
        {site.email.supporting}
      </p>
      <div className={s.emailField}>
        <label className="sr-only" htmlFor={`${id}-email`}>
          Email address
        </label>
        <input
          id={`${id}-email`}
          className={s.emailInput}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          aria-invalid={state === 'error'}
          aria-describedby={state === 'error' ? `${id}-err` : undefined}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === 'error') setState('idle')
          }}
          disabled={state === 'sending'}
        />
        <Button type="submit" variant="primary" lg disabled={state === 'sending'}>
          {state === 'sending' ? 'SENDING…' : site.email.cta}
        </Button>
      </div>
      {state === 'error' && (
        <p id={`${id}-err`} className={`t-meta ${s.emailError}`} role="alert">
          That didn’t go through. Check the address and try again.
        </p>
      )}
      <p className="t-meta">{site.email.note}</p>
    </form>
  )
}
