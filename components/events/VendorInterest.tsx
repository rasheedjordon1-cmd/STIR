'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, Select, TextArea, TextInput } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { zonesByParish } from '@/data/zones';

/* ==========================================================================
   Become a vendor
   An interest register, not an application. Nothing is submitted anywhere in
   the prototype and the form says so before you fill it in, not after.
   ========================================================================== */

const TRADES = [
  'Produce and ground provisions',
  'Preserves, spice and seasoning',
  'Bakery',
  'Prepared food and drink',
  'Personal care and home',
  'Craft and other',
];

export function VendorInterest() {
  const [business, setBusiness] = useState('');
  const [trade, setTrade] = useState(TRADES[0]);
  const [parish, setParish] = useState('St. George');
  const [contact, setContact] = useState('');
  const [about, setAbout] = useState('');
  const [errors, setErrors] = useState<{ business?: string; contact?: string }>({});
  const [done, setDone] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!business.trim()) next.business = 'Tell us the name you trade under.';
    if (!contact.trim()) next.contact = 'We need a phone number or email to reply to.';
    setErrors(next);
    if (Object.keys(next).length === 0) setDone(true);
  };

  if (done) {
    return (
      <Notice tone="ok" role="status" title="Noted — in the prototype only">
        Thanks, {business}. In a live build this would join the vendor waiting list for the next
        allocation round. Nothing was sent anywhere: this prototype has no backend.
      </Notice>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <Notice tone="prototype">
        This form does not submit anywhere. It is here to show what the vendor pipeline would ask
        for.
      </Notice>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Business name" error={errors.business}>
          {(props) => (
            <TextInput
              {...props}
              value={business}
              onChange={(event) => setBusiness(event.target.value)}
              placeholder="Concord Valley Spice Co."
            />
          )}
        </Field>
        <Field label="Phone or email" error={errors.contact}>
          {(props) => (
            <TextInput
              {...props}
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="473 000 0000"
            />
          )}
        </Field>
        <Field label="What do you sell?">
          {(props) => (
            <Select {...props} value={trade} onChange={(event) => setTrade(event.target.value)}>
              {TRADES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Where are you based?">
          {(props) => (
            <Select {...props} value={parish} onChange={(event) => setParish(event.target.value)}>
              {zonesByParish().map((group) => (
                <option key={group.parish}>{group.parish}</option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <Field label="Anything we should know?" optional hint="Stall size, power needs, how much you can bring.">
        {(props) => (
          <TextArea {...props} value={about} onChange={(event) => setAbout(event.target.value)} />
        )}
      </Field>

      <div>
        <Button type="submit" size="lg" icon="Vendor">
          Register interest
        </Button>
      </div>
    </form>
  );
}
