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
        <ol className="grid list-none gap-6 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => (
            <li key={step.title} className="border-border-subtle border-t pt-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="bg-forest text-text-inverse font-display num flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
                  {index + 1}
                </span>
                <Icon name={step.icon} size={24} className="text-state-success" />
              </div>
              <h3 className="text-lg">{step.title}</h3>
              <p className="text-text-secondary mt-2 text-base">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
