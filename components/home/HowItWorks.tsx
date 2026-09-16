import { Icon, type IconName } from '@/components/icons';
import { Section, SectionHead } from '@/components/ui/Section';

const STEPS: { icon: IconName; title: string; detail: string }[] = [
  {
    icon: 'LocationPin',
    title: 'Choose your location',
    detail:
      'Pick your area first. Spicemart only promises a window it can actually run, so the whole shop adapts to where you are.',
  },
  {
    icon: 'Groceries',
    title: 'Shop everyday essentials',
    detail:
      'Search, browse eight aisles, or reorder your usuals. Prices are in EC$ with unit prices so sizes can be compared honestly.',
  },
  {
    icon: 'DeliveryVan',
    title: 'Take delivery or collect',
    detail:
      'Local delivery in serviced parishes, collection at a counter, or pickup at a Spice Fair when an edition is open for it.',
  },
];

export function HowItWorks() {
  return (
    <Section>
      <div className="shell">
        <SectionHead eyebrow="How Spicemart works" title="Three steps, no surprises" />
        <ol className="grid list-none gap-3 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="border-line-strong bg-paper rounded-[var(--radius-card)] border p-4"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <span className="bg-forest text-breadfruit font-display num flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                <Icon name={step.icon} size={22} className="text-leaf-deep" />
              </div>
              <h3 className="text-md">{step.title}</h3>
              <p className="text-forest-muted mt-1.5 text-sm">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
