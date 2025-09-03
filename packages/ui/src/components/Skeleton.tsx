import * as React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = ({ className = '', ...props }: SkeletonProps) => (
  <div className={["animate-pulse rounded-md bg-black/10", className].join(" ")} {...props} />
);

