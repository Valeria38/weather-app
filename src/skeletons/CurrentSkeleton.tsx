import Card from '@/components/cards/Card';
import { Skeleton } from '@/components/ui/skeleton';

function CurrentSkeleton() {
  return (
    <Card
      title="Current Weather"
      childrenClassName="flex flex-col items-center gap-6"
    >
      <div className="flex flex-col gap-2 items-center">
        <Skeleton className="w-30 h-15" />
        <Skeleton className="rounded-full size-14" />
        <Skeleton className="w-36 h-7" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xl text-center">Local time: </p>
        <Skeleton className="w-36 h-10" />
      </div>
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-gray-500">Feels like</p>
          <Skeleton className="w-16 h-6" />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <p className="text-gray-500">Humidity</p>
          <Skeleton className="w-16 h-6" />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <p className="text-gray-500">Wind speed</p>
          <Skeleton className="w-16 h-6" />
        </div>
      </div>
    </Card>
  );
}

export default CurrentSkeleton;
