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
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = () => setShowPassword((prev) => !prev);

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          {...props}
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={showPassword && value.length > 0 ? 'geist-mono' : ''}
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
