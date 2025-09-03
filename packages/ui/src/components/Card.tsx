import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className = '', ...props }: CardProps) => (
  <div
    className={[
      'rounded-xl border border-black/10 bg-white shadow-sm',
      'transition-shadow hover:shadow-md',
      className,
    ].join(' ')}
    {...props}
  />
);

