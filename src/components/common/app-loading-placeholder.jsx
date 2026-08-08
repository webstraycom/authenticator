import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@ui/empty';
import { Spinner } from '@ui/spinner';

export const AppLoadingPlaceholder = () => {
  return (
    <Empty className="animate-in fade-in w-full duration-250">
      <EmptyHeader>
        <EmptyMedia className="bg-accent size-8" variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle className="text-sm">Authenticator is loading</EmptyTitle>
        <EmptyDescription>
          Please wait while the app loads. This usually takes a couple of seconds.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
