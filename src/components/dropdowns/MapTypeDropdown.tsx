import { type Dispatch, type SetStateAction } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '../ui/select';

type Props = {
  mapType: string;
  setMapType: Dispatch<SetStateAction<string>>;
};

function MapTypeDropdown({ mapType, setMapType }: Props) {
  return (
    <Select value={mapType} onValueChange={(value) => setMapType(value)}>
      <SelectTrigger className="w-full sm:w-[150px] xl:w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="z-1001">
        <SelectGroup>
          {types.map((type) => (
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

const types = [
  'clouds_new',
  'precipitation_new',
  'pressure_new',
  'wind_new',
  'temp_new',
];
