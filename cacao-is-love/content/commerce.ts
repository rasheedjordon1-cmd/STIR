/**
 * COMMERCE CONFIGURATION — the two endpoints this site cannot invent.
 *
 * Both are read from the environment so that turning the store on is a deploy
 * setting, not a code change:
 *
 *   NEXT_PUBLIC_CHECKOUT_URL   where CHECKOUT sends the customer
 *   NEXT_PUBLIC_SIGNUP_URL     where the email form POSTs {email}
 *
 * ⚠ WHY THIS FILE EXISTS. Before it, CHECKOUT was a <button> with no handler —
 *   a customer could fill a bag, press it, and nothing at all would happen —
 *   and the newsletter form called setDone(true) without posting anywhere, so
 *   it reported success for an address it had thrown away.
 *
 *   A dead control that looks alive is worse than one that is plainly
 *   unavailable, and a form that fakes success is worse than both. Neither is
 *   something a build can conjure, so both are configuration, and both are
 *   listed as launch blockers until they are set.
 */

const clean = (v: string | undefined) => {
  const s = v?.trim()
  return s && s.length > 0 ? s : null
}

export const commerce = {
  checkoutUrl: clean(process.env.NEXT_PUBLIC_CHECKOUT_URL),
  signupUrl: clean(process.env.NEXT_PUBLIC_SIGNUP_URL),
} as const

export const canCheckout = commerce.checkoutUrl !== null
export const canSignup = commerce.signupUrl !== null
