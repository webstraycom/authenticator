import { useState } from 'react';
import * as chrono from 'chrono-node';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from '@ui/input-group';

export const NaturalDatePicker = ({ value, onChange, id }) => {
  const [open, setOpen] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    const parsedDate = chrono.parseDate(text);
    onChange(text, parsedDate);
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    onChange(formatDate(date), date);
    setOpen(false);
  };

  const currentDate = chrono.parseDate(value) || undefined;

  return (
    <InputGroup>
      <InputGroupInput
        id={id}
        placeholder="Next month or in a year"
        value={value}
        onChange={handleInputChange}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton variant="ghost" size="icon-xs" aria-label="Select date">
              <CalendarIcon className="size-4" />
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={handleDateSelect}
              defaultMonth={currentDate}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
};
