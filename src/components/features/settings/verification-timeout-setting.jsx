import { ClockFadingIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import { ButtonGroup } from '@ui/button-group';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@ui/input-group';
import { Label } from '@ui/label';
import { Button } from '@ui/button';
import { Switch } from '@ui/switch';
import { SettingsItem } from '@features/settings/setting-item';
import { useSettingsLogic } from '@hooks/use-settings-logic';

export const VerificationTimeoutSetting = () => {
  const { settings, updateSetting, adjustTimeout } = useSettingsLogic();

  return (
    <SettingsItem
      icon={ClockFadingIcon}
      title="Verification Timeout"
      description="Change verification timeout"
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-20" variant="outline">
            Set
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-fit">
          <div className="flex w-full flex-col gap-2">
            <div className="flex flex-col gap-0">
              <h4 className="text-sm font-medium">Verification Timeout</h4>
              <p className="text-muted-foreground text-sm">
                {settings.requireVerification
                  ? settings.verificationTimeout > 0
                    ? `Currently: ${settings.verificationTimeout} minutes`
                    : `Always ask for password`
                  : 'Protection is disabled'}
              </p>
            </div>
            <div
              className={`flex flex-col gap-1 ${!settings.requireVerification && 'pointer-events-none opacity-50'}`}
            >
              <ButtonGroup className="w-full">
                <InputGroup className="w-40">
                  <InputGroupInput
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="5"
                    type="number"
                    min="0"
                    value={settings.verificationTimeout}
                    onChange={(e) =>
                      updateSetting('verificationTimeout', Math.max(0, Number(e.target.value)))
                    }
                  />
                  <InputGroupAddon align="inline-end">minutes</InputGroupAddon>
                </InputGroup>
                <Button
                  className="w-8"
                  variant="outline"
                  aria-label="Search"
                  onClick={() => adjustTimeout(-1)}
                >
                  <MinusIcon />
                </Button>
                <Button
                  className="w-8"
                  variant="outline"
                  aria-label="Search"
                  onClick={() => adjustTimeout(+1)}
                >
                  <PlusIcon />
                </Button>
              </ButtonGroup>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Switch
                checked={settings.requireVerification}
                onCheckedChange={(val) => updateSetting('requireVerification', val)}
                id="require-verification"
              />
              <Label htmlFor="require-verification">Enable Verification Timeout</Label>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </SettingsItem>
  );
};
