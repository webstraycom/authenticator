import { ArrowUpRightIcon } from 'lucide-react';
import { Button } from '@ui/Button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@ui/Empty';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/Popover';

export const NoItemsPlaceholder = ({
    onAdd,
    onImport,
    options: {icon, header, description, buttonText}
   }) => {
  return (
    <Empty className="h-full w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{header}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={onAdd}>{buttonText}</Button>
          <Button onClick={onImport} variant="outline">
            Import
          </Button>
        </div>
      </EmptyContent>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="link" className="text-muted-foreground" size="sm">
            Learn More <ArrowUpRightIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="text-muted-foreground w-72 gap-0 text-sm">
          You can view the WebStray Authenticator documentation at{' '}
          <p className="underline underline-offset-4">https://webstray.com/docs/authenticator</p>
        </PopoverContent>
      </Popover>
    </Empty>
  );
};
