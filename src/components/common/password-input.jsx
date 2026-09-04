import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@ui/input-group';

export const PasswordInput = ({ id, ref, label, description, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = () => setShowPassword((prev) => !prev);
  const isInvalid = !!error;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          {...props}
          id={id}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          aria-invalid={isInvalid}
          className={showPassword ? '[&:not(:placeholder-shown)]:font-mono' : ''}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-xs"
            onClick={toggleShow}
            aria-label={!showPassword ? 'Show secret' : 'Hide secret'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={[error]} />}
    </Field>
  );
};
