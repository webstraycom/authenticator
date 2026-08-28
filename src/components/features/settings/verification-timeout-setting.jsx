import { ClockFadingIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { Button } from '@ui/button';
import { ButtonGroup } from '@ui/button-group';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@ui/input-group';
import { Label } from '@ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import { Switch } from '@ui/switch';
import { SettingItem } from '@features/settings/setting-item';
import { useSettingsLogic } from '@hooks/use-settings-logic';

export const VerificationTimeoutSetting = () => {
  const { settings, updateSetting, adjustTimeout } = useSettingsLogic();
  const isDisabled = !settings.requireVerification;

  return (
    <SettingItem
      icon={ClockFadingIcon}
      title="Verification Timeout"
      description="Change verification timeout"
    >
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button className="w-20" variant="outline">
            Set
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-fit">
          <div className="flex w-full flex-col gap-3">
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
                  disabled={isDisabled}
                  aria-label="Verification timeout in minutes"
                />
                <InputGroupAddon align="inline-end">minutes</InputGroupAddon>
              </InputGroup>
              <Button
                className="w-8"
                variant="outline"
                aria-label="Decrease timeout by 1 minute"
                onClick={() => adjustTimeout(-1)}
                disabled={isDisabled}
              >
                <MinusIcon />
              </Button>
              <Button
                className="w-8"
                variant="outline"
                aria-label="Increase timeout by 1 minute"
                onClick={() => adjustTimeout(+1)}
                disabled={isDisabled}
              >
                <PlusIcon />
              </Button>
            </ButtonGroup>
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
    </SettingItem>
  );
};
