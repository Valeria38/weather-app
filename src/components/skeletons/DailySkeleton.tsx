import Card from '@/components/cards/Card';
import { Skeleton } from '@/components/ui/skeleton';

function DailySkeleton() {
  return (
    <Card childrenClassName="flex flex-col gap-4 " title="Daily forecast">
      {Array.from({ length: 8 }).map((_, i) => {
        return (
          <div key={i} className="grid grid-cols-5 gap-20 items-left">
            <Skeleton className="w-9 h-8" />
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
          </div>
        );
      })}
    </Card>
  );
}

export default DailySkeleton;
