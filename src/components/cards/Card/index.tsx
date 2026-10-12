import clsx from 'clsx';
import { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  title?: string;
  className?: string;
  childrenClassName?: string;
};

function Card({ children, title, childrenClassName, className }: Props) {
  const accesibleName = title
    ? title.replace(/\s+/g, '-').toLowerCase()
    : 'card';
  return (
    <section
      aria-labelledby={accesibleName}
      className={clsx(
        'p-4 rounded-xl bg-linear-to-br from-card to-card/60 bg-card shadow-md flex flex-col gap-4 2xl:h-full border dark:border-none',
        className,
      )}
    >
      <h2 className="text-2xl font-semibold" id={accesibleName}>
        {title}
      </h2>
      <div
        className={clsx(
          childrenClassName,
          'animate-[fade-in_1s_ease-out_forwards] 2xl:flex-1',
        )}
      >
        {children}
      </div>
    </section>
  );
}

export default Card;
