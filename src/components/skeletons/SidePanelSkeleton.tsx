import { Skeleton } from '../ui/skeleton';
import SideCardSkeleton from './SideCardSkeleton';

function SidePanelSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold ">Air pollution</h1>
      <Skeleton className="size-12" />
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold ">AQI</h1>
      </div>
      {Array.from({ length: 8 }).map((_, idx) => (
        <SideCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export default SidePanelSkeleton;
