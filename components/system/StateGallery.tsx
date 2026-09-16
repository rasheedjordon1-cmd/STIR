'use client';

import { useState } from 'react';
import { QuantityStepper } from '@/components/commerce/QuantityStepper';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, Select, TextArea, TextInput } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

/** Interactive parts of the style guide that need client state. */
export function StateGallery() {
  const [quantity, setQuantity] = useState(2);
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="label text-forest-muted border-line mb-3 border-b pb-1.5">Form controls</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Text input" hint="Labels are always visible and always associated.">
            {(props) => (
              <TextInput
                {...props}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Grand Anse"
              />
            )}
          </Field>
          <Field label="With an error" error="We need a phone number or email to reply to.">
            {(props) => <TextInput {...props} placeholder="473 000 0000" />}
          </Field>
          <Field label="Select">
            {(props) => (
              <Select {...props} defaultValue="delivery">
                <option value="delivery">Local delivery</option>
                <option value="pickup">Collect in person</option>
                <option value="fair">Spice Fair pickup</option>
              </Select>
            )}
          </Field>
          <Field label="Textarea" optional>
            {(props) => <TextArea {...props} placeholder="Call on arrival. Gate on the left." />}
          </Field>
        </div>
      </section>

      <section>
        <h3 className="label text-forest-muted border-line mb-3 border-b pb-1.5">
          Quantity stepper
        </h3>
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-[160px]">
            <p className="label text-forest-muted mb-1">Default</p>
            <QuantityStepper quantity={quantity} onChange={setQuantity} label="Parboiled Rice" />
          </div>
          <div className="w-[140px]">
            <p className="label text-forest-muted mb-1">Compact</p>
            <QuantityStepper
              quantity={quantity}
              onChange={setQuantity}
              label="Parboiled Rice, compact"
              size="sm"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="label text-forest-muted border-line mb-3 border-b pb-1.5">Inline notices</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <Notice tone="info">Add EC$42.00 more to Grand Anse and delivery is free.</Notice>
          <Notice tone="ok">Location saved. Windows below now match this area.</Notice>
          <Notice tone="caution">
            North route runs Saturdays only. Chilled items are not carried.
          </Notice>
          <Notice tone="error">
            2 items cannot be sent this way. Remove them or change your fulfilment choice.
          </Notice>
          <Notice tone="prototype">Catalogue, prices and order history are sample data.</Notice>
        </div>
      </section>

      <section>
        <h3 className="label text-forest-muted border-line mb-3 border-b pb-1.5">
          Empty, error and loading states
        </h3>
        <div className="grid gap-3 lg:grid-cols-2">
          <EmptyState
            level={4}
            icon="Cart"
            title="Your basket is empty"
            body="Start with the things you buy every week, or pick up where your last order left off."
          >
            <ButtonLink href="/category/groceries">Shop essentials</ButtonLink>
          </EmptyState>
          <EmptyState
            level={4}
            icon="Search"
            tone="caution"
            title="Nothing matched “quinoa”"
            body="Spicemart carries a focused assortment. Try a plainer word, or browse the aisle."
          >
            <ButtonLink href="/category/groceries" intent="secondary">
              Browse groceries
            </ButtonLink>
          </EmptyState>
          <EmptyState
            level={4}
            icon="OutOfStock"
            tone="blocked"
            title="We do not deliver to River Sallee yet"
            body="Not on a route yet. The nearest collection point is Sauteurs, about 15 minutes away."
          >
            <ButtonLink href="/delivery" intent="secondary">
              See all areas
            </ButtonLink>
          </EmptyState>
          <EmptyState
            level={4}
            icon="Alert"
            tone="blocked"
            title="Something went wrong loading this page"
            body="The catalogue did not come back. Your basket is safe on this device."
          >
            <Button icon="Reorder">Try again</Button>
          </EmptyState>
        </div>

        <div className="mt-3">
          <p className="label text-forest-muted mb-2">Loading skeleton</p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        </div>
      </section>
    </div>
  );
}
