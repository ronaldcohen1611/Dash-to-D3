import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { Button } from '../../shared/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../../shared/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../shared/popover';

interface Props {
  className?: string;
  containerClassName?: string;
  items: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  onValueChange: (value: string) => void;
}

export function ComboBox({
  className,
  items,
  placeholder,
  containerClassName,
  onValueChange,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('total_bill');

  return (
    <div className={cn('', containerClassName)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className={cn(className)}>
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
            <CommandGroup className="">
              <CommandList>
                {items.map((items) => (
                  <CommandItem
                    key={items.value}
                    value={items.value}
                    onSelect={(currentValue) => {
                      if (currentValue !== value) {
                        setValue(currentValue);
                        onValueChange(currentValue);
                      }
                      setOpen(false);
                      return null;
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
