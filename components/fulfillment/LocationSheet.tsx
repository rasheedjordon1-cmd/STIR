'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Field, TextArea, TextInput } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { Overlay } from '@/components/ui/Overlay';
import { ServiceStatusPill } from './ServiceStatusPill';
import { zonesByParish } from '@/data/zones';
import { formatMoney } from '@/lib/format';
import { serviceCopy } from '@/lib/fulfillment';
import { useLocation } from '@/lib/store/location';
import { useUI } from '@/lib/store/ui';
import { cx } from '@/lib/cx';

/* ==========================================================================
   LocationSheet
   Serviceability first, address second. The customer picks an area and is
   told immediately what Spicemart can and cannot promise there — before any
   delivery language appears anywhere else in the interface.
   ========================================================================== */

export function LocationSheet() {
  const { overlay, close } = useUI();
  const { zone, saved, setZone, updateDetails } = useLocation();
  const [query, setQuery] = useState('');
  const [addressLine, setAddressLine] = useState(saved.addressLine ?? '');
  const [landmark, setLandmark] = useState(saved.landmark ?? '');
  const [phone, setPhone] = useState(saved.phone ?? '');
  const [instructions, setInstructions] = useState(saved.instructions ?? '');
  const [savedFlash, setSavedFlash] = useState(false);

  const groups = useMemo(() => {
    const all = zonesByParish();
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all
      .map((group) => ({
        parish: group.parish,
        zones: group.zones.filter(
          (z) => z.area.toLowerCase().includes(q) || z.parish.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.zones.length > 0);
  }, [query]);

  const copy = serviceCopy(zone);

  return (
    <Overlay
      open={overlay === 'location'}
      onClose={close}
      side="bottom"
      title="Delivery area"
      description="Choose where this order is going. Everything else follows from it."
      footer={
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-text-secondary text-xs font-semibold">Delivering to</p>
            <p className="truncate text-sm font-semibold">
              {zone.area}, {zone.parish}
            </p>
          </div>
          <Button
            onClick={() => {
              updateDetails({ addressLine, landmark, phone, instructions });
              setSavedFlash(true);
              setTimeout(close, 450);
            }}
          >
            {savedFlash ? 'Saved' : 'Save location'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div
          className={cx(
            'rounded-[var(--radius-card)] border p-3',
            copy.tone === 'ok' && 'border-leaf-deep/40 bg-surface-green-soft',
            copy.tone === 'caution' && 'border-cocoa/40 bg-surface-yellow-soft',
            copy.tone === 'blocked' && 'border-nutmeg/50 bg-surface-nutmeg-soft',
          )}
        >
          <p className="text-text-secondary text-xs font-semibold">Currently selected</p>
          <p className="mt-0.5 text-lg font-bold">
            {zone.area}, {zone.parish}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ServiceStatusPill zone={zone} />
            <span className="text-sm font-medium">{copy.detail}</span>
          </div>
          {zone.serviceStatus === 'delivery-available' ? (
            <p className="text-text-secondary mt-2 text-sm">
              Delivery {formatMoney(zone.deliveryFee)}
              {zone.freeDeliveryThreshold
                ? ` · free over ${formatMoney(zone.freeDeliveryThreshold)}`
                : ''}
            </p>
          ) : null}
          {zone.note ? <p className="text-text-secondary mt-2 text-sm">{zone.note}</p> : null}
        </div>

        <div>
          <Field label="Find your area">
            {(props) => (
              <TextInput
                {...props}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Grand Anse, Grenville, Gouyave…"
              />
            )}
          </Field>

          <div className="mt-3 flex flex-col gap-4">
            {groups.length === 0 ? (
              <Notice tone="caution">
                No area matches “{query}”. Spicemart covers {zonesByParish().length} parishes — try a
                nearby town.
              </Notice>
            ) : null}

            {groups.map((group) => (
              <div key={group.parish}>
                <p className="label text-text-secondary border-border-subtle mb-1.5 border-b pb-1">
                  {group.parish}
                </p>
                <ul className="flex flex-col">
                  {group.zones.map((z) => {
                    const selected = z.id === zone.id;
                    const zoneCopy = serviceCopy(z);
                    return (
                      <li key={z.id}>
                        <button
                          type="button"
                          onClick={() => setZone(z.id)}
                          aria-current={selected ? 'true' : undefined}
                          className={cx(
                            'border-border-subtle flex w-full min-h-11 items-center gap-3 border-b px-2 py-2.5 text-left',
                            selected ? 'bg-surface-green-soft' : 'hover:bg-surface-card',
                          )}
                        >
                          <span
                            className={cx(
                              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                              selected ? 'border-leaf-deep bg-leaf-deep text-paper' : 'border-border-subtle',
                            )}
                          >
                            {selected ? <Icon name="Check" size={12} /> : null}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-base font-semibold">{z.area}</span>
                            <span className="text-text-secondary block text-sm">
                              {zoneCopy.label} · {zoneCopy.detail}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-border-subtle border-t pt-4">
          <h3 className="text-md mb-1">Delivery details</h3>
          <p className="text-text-secondary mb-3 text-sm">
            Saved on this device only. In the prototype nothing is sent anywhere.
          </p>
          <div className="flex flex-col gap-3">
            <Field label="Address" optional>
              {(props) => (
                <TextInput
                  {...props}
                  value={addressLine}
                  onChange={(event) => setAddressLine(event.target.value)}
                  placeholder="House or building, street"
                  autoComplete="street-address"
                />
              )}
            </Field>
            <Field label="Landmark" hint="Most useful direction for a driver." optional>
              {(props) => (
                <TextInput
                  {...props}
                  value={landmark}
                  onChange={(event) => setLandmark(event.target.value)}
                  placeholder="Opposite the health centre"
                />
              )}
            </Field>
            <Field label="Phone" optional>
              {(props) => (
                <TextInput
                  {...props}
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="473 000 0000"
                  autoComplete="tel"
                />
              )}
            </Field>
            <Field label="Delivery instructions" optional>
              {(props) => (
                <TextArea
                  {...props}
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  placeholder="Call on arrival. Gate is on the left."
                />
              )}
            </Field>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
