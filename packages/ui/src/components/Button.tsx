import * as React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
const variants: Record<Variant, string> = {
  primary:
    'bg-[#7ED9A3] text-black hover:bg-[#68c88f] focus:ring-[#7ED9A3] focus:ring-offset-[#FFF9F4]',
  secondary:
    'bg-[#FFC8A2] text-black hover:bg-[#f7b48b] focus:ring-[#FFC8A2] focus:ring-offset-[#FFF9F4]',
  ghost: 'bg-transparent hover:bg-black/5 text-black',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', ...props }, ref) => (
    <button ref={ref} className={[base, variants[variant], className].join(' ')} {...props} />
  )
);
Button.displayName = 'Button';

