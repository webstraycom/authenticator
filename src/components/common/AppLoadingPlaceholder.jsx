import { LoaderIcon } from 'lucide-react';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@ui/Empty';

export const AppLoadingPlaceholder = () => {
  return (
    <Empty className="animate-in fade-in w-full duration-250">
      <EmptyHeader>
        <EmptyMedia className="bg-accent size-8" variant="icon">
          <LoaderIcon className="size-4 animate-spin" />
        </EmptyMedia>
        <EmptyTitle className="text-sm">Authenticator is loading</EmptyTitle>
        <EmptyDescription>
          Please wait while the app loads. This usually takes a couple of seconds.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
