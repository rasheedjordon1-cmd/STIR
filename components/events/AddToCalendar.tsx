'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SPICE_FAIR } from '@/data/config';
import type { SpiceFairEvent } from '@/types';

/* ==========================================================================
   AddToCalendar
   Builds an .ics file in the browser. No third-party calendar service, no
   tracking link — the file is generated from the event record and handed
   straight to the operating system.
   ========================================================================== */

const stamp = (date: string, time: string) =>
  `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;

export function AddToCalendar({ event, intent = 'secondary' }: { event: SpiceFairEvent; intent?: 'secondary' | 'inverse' }) {
  const [added, setAdded] = useState(false);

  const download = () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Spicemart//The Spice Fair//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${event.id}@spicemart`,
      `DTSTART;TZID=America/Grenada:${stamp(event.date, event.startTime)}`,
      `DTEND;TZID=America/Grenada:${stamp(event.date, event.endTime)}`,
      `SUMMARY:${SPICE_FAIR.name} — ${event.area}`,
      `LOCATION:${event.venue}\\, ${event.area}\\, ${event.parish}\\, Grenada`,
      `DESCRIPTION:${event.description.replace(/,/g, '\\,')}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spice-fair-${event.date}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <Button intent={intent} icon="Calendar" onClick={download}>
      {added ? 'Calendar file saved' : 'Add to calendar'}
    </Button>
  );
}
