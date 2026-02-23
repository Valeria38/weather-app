import clsx from 'clsx';
import React, { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  title?: string;
  className?: string;
  childrenClassName?: string;
};

function Card({ children, title, childrenClassName, className }: Props) {
  return (
    <div
      className={clsx(
        'p-4 rounded-xl bg-linear-to-br from-card to-card/60 bg-card shadow-md flex flex-col gap-4',
        className,
      )}
    >
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div
        className={clsx(
          childrenClassName,
          'animate-[fade-in_1s_ease-out_forwards]',
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default Card;
