import { type Dispatch, type SetStateAction } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MAP_TYPES, type MapType } from '@/lib/queryPersistence';

type Props = {
  mapType: MapType;
  setMapType: Dispatch<SetStateAction<MapType>>;
};

function MapTypeDropdown({ mapType, setMapType }: Props) {
  return (
    <Select
      value={mapType}
      onValueChange={(value) => {
        const selectedMapType = MAP_TYPES.find((type) => type === value);
        if (selectedMapType) setMapType(selectedMapType);
      }}
    >
      <SelectTrigger
        className="w-full sm:w-[150px] xl:w-[180px]"
        aria-label="Map type"
      >
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="z-1001">
        <SelectGroup>
          {MAP_TYPES.map((type) => (
            <SelectItem key={type} value={type} className="capitalize">
              {type.replace('_new', '')}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default MapTypeDropdown;
