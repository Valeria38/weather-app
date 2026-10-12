import { Activity, type Dispatch, type SetStateAction } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
};

function LocationDropdown({ location, setLocation }: Props) {
  return (
    <Select value={location} onValueChange={(value) => setLocation(value)}>
      <SelectTrigger
        className="w-full sm:w-[150px] xl:w-[180px]"
        aria-label="Location"
      >
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="z-1001">
        <Activity mode={location === 'custom' ? 'hidden' : 'visible'}>
          <SelectItem value="custom">Custom</SelectItem>
        </Activity>
        <SelectGroup>
          {locations.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default LocationDropdown;

const locations = [
  'Bangkok',
  'Tokyo',
  'Seoul',
  'Dubai',
  'Manila',
  'London',
  'New York',
  'Paris',
  'Berlin',
  'Madrid',
  'Rome',
  'Lisbon',
];
