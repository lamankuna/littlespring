import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'mint' | 'peach' | 'neutral';
}

export const Badge = ({ tone = 'neutral', className = '', ...props }: BadgeProps) => (
  <span
    className={[
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      tone === 'mint' && 'bg-[#E6F8EE] text-[#1F5135] border border-[#7ED9A3]/30',
      tone === 'peach' && 'bg-[#FFF0E7] text-[#6B3A24] border border-[#FFC8A2]/30',
      tone === 'neutral' && 'bg-black/5 text-black',
      className,
    ].join(' ')}
    {...props}
  />
);

