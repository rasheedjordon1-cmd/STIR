import type { ReactNode, SVGProps } from 'react';

/* ==========================================================================
   SPICEMART icon system
   --------------------------------------------------------------------------
   One grammar, no libraries, no emoji.

   · 24×24 box, live area 3–21, optical centre respected over geometric centre
   · single stroke weight (1.75) in currentColor, round caps and round joins
   · no fills except where a shape is genuinely solid (none currently)
   · curves are drawn as the logo's "S" is drawn: one continuous cut with a
     fat middle and tapering ends, rather than a constant-radius arc
   · every icon must survive at 20px — silhouette first, detail never

   Add an icon by adding one entry to PATHS. It is automatically typed,
   automatically available to <Icon name="…" />, and automatically appears in
   the /system gallery.
   ========================================================================== */

const PATHS = {
  /* ---- Navigation ------------------------------------------------------- */
  Home: (
    <>
      <path d="M3.7 10.7 12 4.1l8.3 6.6v8.1a1.7 1.7 0 0 1-1.7 1.7H5.4a1.7 1.7 0 0 1-1.7-1.7Z" />
      <path d="M9.4 20.5v-4.9a2.6 2.6 0 0 1 5.2 0v4.9" />
    </>
  ),
  Categories: (
    <>
      <rect x="3.4" y="3.4" width="7.2" height="7.2" rx="2.2" />
      <rect x="13.4" y="3.4" width="7.2" height="7.2" rx="2.2" />
      <rect x="3.4" y="13.4" width="7.2" height="7.2" rx="2.2" />
      <circle cx="17" cy="17" r="3.6" />
    </>
  ),
  Search: (
    <>
      <circle cx="10.6" cy="10.6" r="6.4" />
      <path d="m15.4 15.4 4.8 4.8" />
    </>
  ),
  Orders: (
    <>
      <path d="M12 3.6 19.8 7.6v8.8L12 20.4 4.2 16.4V7.6Z" />
      <path d="M4.2 7.6 12 11.6l7.8-4" />
      <path d="M12 11.6v8.8" />
    </>
  ),
  Rewards: (
    <>
      <circle cx="12" cy="8.4" r="5.2" />
      <path d="M8.2 12.5 5.4 21l6.6-3.4L18.6 21l-2.8-8.5" />
    </>
  ),
  Account: (
    <>
      <circle cx="12" cy="8.2" r="3.9" />
      <path d="M4.7 20.4c.9-4.1 3.8-6.2 7.3-6.2s6.4 2.1 7.3 6.2" />
    </>
  ),
  Cart: (
    <>
      <path d="M3.4 8.6h17.2l-1.7 9.3a2.3 2.3 0 0 1-2.2 1.9H7.3a2.3 2.3 0 0 1-2.2-1.9Z" />
      <path d="M8.7 8.6 11 4.2M15.3 8.6 13 4.2" />
    </>
  ),
  Menu: <path d="M3.8 7h16.4M3.8 12h11.6M3.8 17h16.4" />,
  Back: (
    <>
      <path d="M13.8 5.4 7.2 12l6.6 6.6" />
      <path d="M7.4 12h13.4" />
    </>
  ),
  Close: <path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6" />,

  /* ---- Commerce --------------------------------------------------------- */
  Add: <path d="M12 5.2v13.6M5.2 12h13.6" />,
  Remove: (
    <>
      <path d="M5.4 7.2h13.2" />
      <path d="M9.6 7.2V5.8a1.5 1.5 0 0 1 1.5-1.5h1.8a1.5 1.5 0 0 1 1.5 1.5v1.4" />
      <path d="m7.2 7.2.9 11.1a1.7 1.7 0 0 0 1.7 1.6h4.4a1.7 1.7 0 0 0 1.7-1.6l.9-11.1" />
    </>
  ),
  QuantityIncrease: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5.2" />
      <path d="M12 8.2v7.6M8.2 12h7.6" />
    </>
  ),
  QuantityDecrease: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5.2" />
      <path d="M8.2 12h7.6" />
    </>
  ),
  Favorite: (
    <path d="M12 20.3C12 20.3 3.7 15.5 3.7 9.9a4.2 4.2 0 0 1 8.3-1 4.2 4.2 0 0 1 8.3 1c0 5.6-8.3 10.4-8.3 10.4Z" />
  ),
  Reorder: (
    <>
      <path d="M4.8 12.4a7.2 7.2 0 0 1 12.4-4.9" />
      <path d="M17.6 3.4v4.3h-4.3" />
      <path d="M19.2 11.6a7.2 7.2 0 0 1-12.4 4.9" />
      <path d="M6.4 20.6v-4.3h4.3" />
    </>
  ),
  ShoppingBag: (
    <>
      <path d="M6.2 8.2h11.6l.9 10.7a1.9 1.9 0 0 1-1.9 2H7.2a1.9 1.9 0 0 1-1.9-2Z" />
      <path d="M9 8.2V6.7a3 3 0 0 1 6 0v1.5" />
    </>
  ),
  Receipt: (
    <>
      <path d="M6.2 3.8h11.6v16.6l-2.9-1.7-2.9 1.7-2.9-1.7-2.9 1.7Z" />
      <path d="M9.2 8.6h5.6M9.2 12.4h5.6" />
    </>
  ),
  SecurePayment: (
    <>
      <path d="M12 3.6 19.4 6v6.1c0 4.3-3.1 7.1-7.4 8.3-4.3-1.2-7.4-4-7.4-8.3V6Z" />
      <path d="m8.9 12 2.2 2.3 4-4.5" />
    </>
  ),
  Discount: (
    <>
      <path d="M20.2 12.6 12.6 20.2a1.8 1.8 0 0 1-2.5 0l-6.3-6.3a1.8 1.8 0 0 1-.5-1.3V4.9a1.5 1.5 0 0 1 1.5-1.5h7.7c.5 0 .9.2 1.3.5l6.4 6.4a1.8 1.8 0 0 1 0 2.3Z" />
      <circle cx="8.3" cy="8.3" r="1.5" />
    </>
  ),
  OutOfStock: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="m6.2 6.2 11.6 11.6" />
    </>
  ),
  LowStock: (
    <>
      <rect x="2.8" y="7.6" width="16.4" height="8.8" rx="2.2" />
      <path d="M21.4 10.6v2.8" />
      <path d="M6.2 10.4v3.2" />
      <path d="M10 10.4v3.2" strokeOpacity="0.35" />
      <path d="M13.8 10.4v3.2" strokeOpacity="0.35" />
    </>
  ),

  /* ---- Fulfilment ------------------------------------------------------- */
  DeliveryVan: (
    <>
      <path d="M2.8 7h10.4v9.4H2.8Z" />
      <path d="M13.2 10.4h3.5l3.5 3v3h-7Z" />
      <circle cx="7" cy="18.4" r="2" />
      <circle cx="16.8" cy="18.4" r="2" />
    </>
  ),
  LocationPin: (
    <>
      <path d="M12 20.8s6.6-5.5 6.6-10.3a6.6 6.6 0 1 0-13.2 0C5.4 15.3 12 20.8 12 20.8Z" />
      <circle cx="12" cy="10.4" r="2.5" />
    </>
  ),
  MapArea: (
    <>
      <path d="M3.4 6.6 9 4.4v13.2l-5.6 2.2Z" />
      <path d="M9 4.4l6 2.2v13.2L9 17.6" />
      <path d="M15 6.6 20.6 4.4v13.2L15 19.8" />
    </>
  ),
  Clock: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.2V12l3.4 2" />
    </>
  ),
  Calendar: (
    <>
      <rect x="3.6" y="5.4" width="16.8" height="15" rx="2.4" />
      <path d="M3.6 10.2h16.8" />
      <path d="M8.2 3.4v3.6M15.8 3.4v3.6" />
    </>
  ),
  StorePickup: (
    <>
      <path d="M3.2 9.4 5.4 4.6h13.2l2.2 4.8Z" />
      <path d="M4.8 9.4v9.4a1.7 1.7 0 0 0 1.7 1.7h11a1.7 1.7 0 0 0 1.7-1.7V9.4" />
      <path d="M9.8 20.5v-5.2h4.4v5.2" />
    </>
  ),
  SpiceFairPickup: (
    <>
      <path d="M3.2 9.2 5.4 4.4h13.2l2.2 4.8Z" />
      <path d="m3.2 9.2 3 1.8 3-1.8 3 1.8 3-1.8 3 1.8 2.6-1.8" />
      <path d="M9 13.8h6l.6 6.6H8.4Z" />
    </>
  ),
  OrderTracking: (
    <>
      <path d="M4 12h16" />
      <circle cx="5.4" cy="12" r="2.2" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="18.6" cy="12" r="2.2" />
    </>
  ),
  Phone: (
    <path d="M7.6 3.8 9.9 8.5l-2 1.9a12.2 12.2 0 0 0 5.7 5.7l1.9-2 4.7 2.3v2.8a1.9 1.9 0 0 1-2.1 1.9C10.5 20.6 3.4 13.5 2.9 5.9A1.9 1.9 0 0 1 4.8 3.8Z" />
  ),
  DeliveryInstructions: (
    <>
      <path d="M5.4 3.8h9.2l4.2 4.2v12.4a1.7 1.7 0 0 1-1.7 1.7H5.4a1.7 1.7 0 0 1-1.7-1.7V5.5a1.7 1.7 0 0 1 1.7-1.7Z" />
      <path d="M14.4 3.8V8h4.4" />
      <path d="M7.4 13h8M7.4 16.6h5" />
    </>
  ),

  /* ---- Categories ------------------------------------------------------- */
  Groceries: (
    <>
      <path d="M4.2 8.6h15.6l-1 10.4a1.9 1.9 0 0 1-1.9 1.7H7.1a1.9 1.9 0 0 1-1.9-1.7Z" />
      <path d="M4.2 8.6 6.4 3.6h11.2l2.2 5" />
      <path d="M9.4 3.6v5M14.6 3.6v5" />
    </>
  ),
  FreshProduce: (
    <>
      <path d="M20.2 4.2c0 8.6-4.9 13.5-11.4 13.5a5.7 5.7 0 0 1-5-5.3C3.8 5.9 8.8 4.2 20.2 4.2Z" />
      <path d="M5.4 20.4c2.8-6.6 6.9-10.7 12.6-13.2" />
    </>
  ),
  Household: (
    <>
      <path d="M10 8.6h4.6a2.1 2.1 0 0 1 2.1 2.1v7.6a2.1 2.1 0 0 1-2.1 2.1H10a2.1 2.1 0 0 1-2.1-2.1v-7.6A2.1 2.1 0 0 1 10 8.6Z" />
      <path d="M11 8.6V5.4h3.4v3.2" />
      <path d="m7.9 11-2.9-2M14.4 5.4h3.8" />
    </>
  ),
  PersonalCare: (
    <>
      <rect x="3.2" y="11.4" width="14.4" height="9.2" rx="3" />
      <path d="M3.2 15.4h14.4" />
      <circle cx="18.4" cy="5.6" r="2.6" />
      <circle cx="12.4" cy="6.4" r="1.4" />
    </>
  ),
  Drinks: (
    <>
      <path d="M5.8 6.2h12.4l-1.5 13a1.9 1.9 0 0 1-1.9 1.7H9.2a1.9 1.9 0 0 1-1.9-1.7Z" />
      <path d="M6.4 11.6h11.2" />
      <path d="M14.2 6.2 17.6 2.4" />
    </>
  ),
  Pantry: (
    <>
      <path d="M6 9.6h12v9.2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z" />
      <rect x="4.8" y="5" width="14.4" height="4.6" rx="1.6" />
      <path d="M6 13.6h12" />
    </>
  ),
  FrozenChilled: (
    <>
      <path d="M12 3.4v17.2M4.6 7.7l14.8 8.6M4.6 16.3l14.8-8.6" />
      <path d="m9.6 5.6 2.4 2 2.4-2M9.6 18.4l2.4-2 2.4 2" />
    </>
  ),
  LocalVendors: (
    <>
      <path d="M12 20.8s6.4-5.4 6.4-10.1a6.4 6.4 0 0 0-12.8 0c0 4.7 6.4 10.1 6.4 10.1Z" />
      <path d="M15.6 7.4c0 3.4-2 5.3-5 5.3a2.2 2.2 0 0 1-2-2.2c0-2.6 2.2-3.1 7-3.1Z" />
    </>
  ),
  NewArrivals: (
    <>
      <path d="M12 20.6v-9.4" />
      <path d="M12 11.2c0-3.5 2.1-5.6 5.6-5.6 0 3.5-2.1 5.6-5.6 5.6Z" />
      <path d="M12 14.6c-3.1 0-5-1.9-5-5 3.1 0 5 1.9 5 5Z" />
    </>
  ),
  Deals: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
      <path d="m9 15 6-6" />
      <circle cx="9.3" cy="9.3" r="1.3" />
      <circle cx="14.7" cy="14.7" r="1.3" />
    </>
  ),

  /* ---- Events ----------------------------------------------------------- */
  MarketStall: (
    <>
      <path d="M3.2 9 5.4 4.4h13.2L20.8 9Z" />
      <path d="M5.6 9v11.4M18.4 9v11.4" />
      <path d="M5.6 14.8h12.8v5.6H5.6Z" />
    </>
  ),
  Ticket: (
    <>
      <path d="M4.2 6.4h15.6a1.6 1.6 0 0 1 1.6 1.6v1.8a2.2 2.2 0 0 0 0 4.4V16a1.6 1.6 0 0 1-1.6 1.6H4.2A1.6 1.6 0 0 1 2.6 16v-1.8a2.2 2.2 0 0 0 0-4.4V8a1.6 1.6 0 0 1 1.6-1.6Z" />
      <path d="M12.6 8.4v1.6M12.6 11.6v1.6M12.6 14.8v1.6" />
    </>
  ),
  Food: (
    <>
      <path d="M4.8 16.2a7.2 7.2 0 0 1 14.4 0" />
      <path d="M3.2 16.2h17.6" />
      <path d="M12 9V6.6" />
      <path d="M3.2 19.6h17.6" />
    </>
  ),
  Celebration: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="9" cy="10" r="2.1" />
      <circle cx="15" cy="10" r="2.1" />
      <circle cx="12" cy="15.4" r="2.1" />
    </>
  ),
  Vendor: (
    <>
      <circle cx="12" cy="6.9" r="3.1" />
      <path d="M5.8 20.4v-1.2A6.2 6.2 0 0 1 12 13a6.2 6.2 0 0 1 6.2 6.2v1.2Z" />
      <path d="M9.7 13.5v6.9M14.3 13.5v6.9" />
    </>
  ),
  Community: (
    <>
      <circle cx="9" cy="8.8" r="2.9" />
      <circle cx="16.4" cy="10.2" r="2.2" />
      <path d="M3.6 19.8a5.4 5.4 0 0 1 10.8 0" />
      <path d="M15.2 15.4a4.4 4.4 0 0 1 5.2 4.4" />
    </>
  ),

  /* ---- Interface utility ------------------------------------------------ */
  ChevronRight: <path d="m9.4 5.6 6.4 6.4-6.4 6.4" />,
  ChevronLeft: <path d="M14.6 5.6 8.2 12l6.4 6.4" />,
  ChevronDown: <path d="m5.6 9.4 6.4 6.4 6.4-6.4" />,
  ChevronUp: <path d="m5.6 14.6 6.4-6.4 6.4 6.4" />,
  Check: <path d="m4.8 12.4 4.7 4.8 9.7-10.4" />,
  Info: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 11v5.4" />
      <path d="M12 7.6v.9" />
    </>
  ),
  Alert: (
    <>
      <path d="M12 3.8 21 19.4a1.4 1.4 0 0 1-1.2 2.1H4.2A1.4 1.4 0 0 1 3 19.4Z" />
      <path d="M12 9.6v4.8" />
      <path d="M12 17.4v.9" />
    </>
  ),
  Filter: (
    <>
      <path d="M3.6 6.4h16.8M6.4 12h11.2M9.6 17.6h4.8" />
    </>
  ),
  Sort: (
    <>
      <path d="M6.6 4.4v15.2M3.4 16.4l3.2 3.2 3.2-3.2" />
      <path d="M17.4 19.6V4.4M14.2 7.6l3.2-3.2 3.2 3.2" />
    </>
  ),
  External: (
    <>
      <path d="M13.4 4.4h6.2v6.2" />
      <path d="M19.6 4.4 11 13" />
      <path d="M17.4 14.2v4.4a1.9 1.9 0 0 1-1.9 1.9H5.4a1.9 1.9 0 0 1-1.9-1.9V8.5a1.9 1.9 0 0 1 1.9-1.9h4.4" />
    </>
  ),
  Grid: (
    <>
      <rect x="3.6" y="3.6" width="7" height="7" rx="1.8" />
      <rect x="13.4" y="3.6" width="7" height="7" rx="1.8" />
      <rect x="3.6" y="13.4" width="7" height="7" rx="1.8" />
      <rect x="13.4" y="13.4" width="7" height="7" rx="1.8" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

export const ICON_NAMES = Object.keys(PATHS) as IconName[];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
  /**
   * Alt-text strategy: icons are decorative by default and hidden from
   * assistive technology, because every icon in this interface sits beside a
   * real text label. Pass `title` only for the rare icon that carries meaning
   * on its own (a status chip with no words).
   */
  title?: string;
}

export function Icon({ name, size = 22, title, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}

/** Grouping used by the /system gallery. Keep in sync when adding icons. */
export const ICON_GROUPS: { title: string; names: IconName[] }[] = [
  {
    title: 'Navigation',
    names: ['Home', 'Categories', 'Search', 'Orders', 'Rewards', 'Account', 'Cart', 'Menu', 'Back', 'Close'],
  },
  {
    title: 'Commerce',
    names: [
      'Add',
      'Remove',
      'QuantityIncrease',
      'QuantityDecrease',
      'Favorite',
      'Reorder',
      'ShoppingBag',
      'Receipt',
      'SecurePayment',
      'Discount',
      'OutOfStock',
      'LowStock',
    ],
  },
  {
    title: 'Fulfilment',
    names: [
      'DeliveryVan',
      'LocationPin',
      'MapArea',
      'Clock',
      'Calendar',
      'StorePickup',
      'SpiceFairPickup',
      'OrderTracking',
      'Phone',
      'DeliveryInstructions',
    ],
  },
  {
    title: 'Categories',
    names: [
      'Groceries',
      'FreshProduce',
      'Household',
      'PersonalCare',
      'Drinks',
      'Pantry',
      'FrozenChilled',
      'LocalVendors',
      'NewArrivals',
      'Deals',
    ],
  },
  {
    title: 'Events',
    names: ['MarketStall', 'Ticket', 'Food', 'Celebration', 'Vendor', 'Community'],
  },
  {
    title: 'Interface',
    names: ['ChevronRight', 'ChevronLeft', 'ChevronDown', 'ChevronUp', 'Check', 'Info', 'Alert', 'Filter', 'Sort', 'External', 'Grid'],
  },
];
