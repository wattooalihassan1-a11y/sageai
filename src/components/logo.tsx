import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1080 1080"
      {...props}
    >
      <path
        fill="#002d72"
        d="M589.6,601.4H492.3V310.2h281.4v88.3H589.6V601.4z M852,310.2v291.1H948V310.2H852z"
      />
      <path fill="#2196f3" d="M228.6,601.4h-95V420.5h95V601.4z" />
      <path fill="#2196f3" d="M375.4,601.4h-95V364.7h95V601.4z" />
    </svg>
  );
}
