import { Field, FieldError, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';

export const FormInput = ({ label, id, error, children, ...props }) => {
  const isInvalid = !!error;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input {...props} id={id} aria-invalid={isInvalid} />
      {isInvalid && <FieldError errors={[error]} />}
      {children}
    </Field>
  );
};
