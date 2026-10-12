import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function StartersIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M9.5 4.5l-5 5m15 5l-5 5M4 14l6-6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l3-3m15-15l-3 3" />
    </svg>
  );
}

export function MainsIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v2m-8 8a8 8 0 0116 0H4zm-1 3h18" />
    </svg>
  );
}

export function PastaIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 11a8 8 0 0016 0H4zm4-4c0 2 1 2 2 4m2-4c0 2 1 2 2 4m2-4c0 2 1 2 2 4M3 19h18" />
    </svg>
  );
}

export function PizzaIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21L3 6a15.7 15.7 0 0118 0l-9 15zM9 10a1 1 0 100-2 1 1 0 000 2zm4 4a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  );
}

export function SaladsIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12a7 7 0 0014 0H5zm7-8c2 3 1 6-2 7m4-5c1 2 0 4-2 5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 19h18" />
    </svg>
  );
}

export function DessertsIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 14a4 4 0 118 0H8zm4-10a2 2 0 012 2v2h-4V6a2 2 0 012-2zM6 14l2 7h8l2-7" />
    </svg>
  );
}

export function BeveragesIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6m-3-6v6M6 4h12l-2 8a4 4 0 01-8 0L6 4z" />
    </svg>
  );
}

export function SignaturesIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

export const categoryIconMap = {
  signatures: SignaturesIcon,
  starters: StartersIcon,
  mains: MainsIcon,
  pasta: PastaIcon,
  pizza: PizzaIcon,
  salads: SaladsIcon,
  desserts: DessertsIcon,
  beverages: BeveragesIcon,
};
