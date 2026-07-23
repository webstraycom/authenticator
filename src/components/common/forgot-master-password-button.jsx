import { Button } from '@ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import { useClearDatabase } from '@hooks/use-clear-database';

export function ForgotMasterPasswordButton({ onSuccess }) {
  const { handleClear } = useClearDatabase();

  const handleClick = () => {
    handleClear({ withVerification: false });
    if (onSuccess) onSuccess();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link">Forgot your master password?</Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-muted-foreground text-sm">
              If you've forgotten your master password, you can completely clear the app's database.
            </p>
          </div>
          <Button variant="outline" onClick={handleClick}>
            Clear Database
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
