import type { SVGProps } from 'react';

export function BrushStrokeDivider(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 5 Q 10 2, 20 5 T 40 5 T 60 5 T 80 5 T 98 5" />
    </svg>
  );
}
