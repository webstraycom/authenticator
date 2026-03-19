import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Field, FieldLabel } from '@ui/Field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@ui/InputGroup';

export const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = () => {
    if (showPassword) {
      setShowPassword(false);
      return;
    }

    setShowPassword(true);
  };

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={showPassword && value.length > 0 ? 'geist-mono' : ''}
          required={required}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-xs"
            onClick={toggleShow}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
};
