
'use client';

import { useState, useEffect } from 'react';

interface ClientDateDisplayProps {
  dateString: string;
  options?: Intl.DateTimeFormatOptions;
}

export function ClientDateDisplay({ dateString, options }: ClientDateDisplayProps) {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    // Ensure this runs only on the client after mount
    setFormattedDate(new Date(dateString).toLocaleDateString(undefined, options));
  }, [dateString, options]);

  if (!formattedDate) {
    // Return a placeholder or null before client-side hydration completes
    // This helps prevent mismatch between server and client initial render.
    // You could use a more sophisticated skeleton loader here if desired.
    return <span>...</span>; 
  }

  return <>{formattedDate}</>;
}
