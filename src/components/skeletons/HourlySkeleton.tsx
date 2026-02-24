import Card from '@/components/cards/Card';
import { Skeleton } from '@/components/ui/skeleton';

function HourlySkeleton() {
  return (
    <Card
      childrenClassName="flex gap-6 overflow-x-scroll"
      title="Hourly forecast(48 hours)"
    >
      {Array.from({ length: 48 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 items-center p-2 2xl:justify-between"
        >
          <Skeleton className="w-15 h-6 2xl:scale-110" />
          <Skeleton className="size-8 2xl:size-10 rounded-full" />
          <Skeleton className="w-8 h-6 2xl:scale-110" />
        </div>
      ))}
    </Card>
  );
}

export default HourlySkeleton;
