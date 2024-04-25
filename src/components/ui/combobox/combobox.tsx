import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { Button } from '../../shared/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../../shared/command';
import { Popover, PopoverContent, PopoverTrigger } from '../../shared/popover';

interface Props {
  className?: string;
  items: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  searchPlaceholder?: string;
}

export function ComboBox({ className, items, placeholder, searchPlaceholder }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <div className={cn('', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? items.find((items) => items.value === value)?.label
              : placeholder ?? ''}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder ?? "Search..."} />
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {items.map((items) => (
                  <CommandItem
                    key={items.value}
                    value={items.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === items.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {items.label}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
