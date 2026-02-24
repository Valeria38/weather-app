import Card from '@/components/cards/Card';
import { Skeleton } from '@/components/ui/skeleton';

function AdditionalInfoSkeleton() {
  return (
    <Card
      childrenClassName="grid grid-cols-1 md:grid-cols-2 gap-8"
      title="Additional weather info"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="flex justify-between" key={i}>
          <div className="flex">
            <Skeleton className="h-8 w-20 mr-4" />
            <Skeleton className="size-8 rounded-full" />
          </div>
          <Skeleton className="size-8" />
        </div>
      ))}
    </Card>
  );
}

export default AdditionalInfoSkeleton;
