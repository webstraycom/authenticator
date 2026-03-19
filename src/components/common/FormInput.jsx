import { Input } from '@ui/Input';
import { Field, FieldLabel } from '@ui/Field';

export const FormInput = ({ label, id, error, children, ...props }) => (
  <Field>
    <FieldLabel htmlFor={id}>{label}</FieldLabel>
    <Input {...props} id={id} />
    {children}
  </Field>
);
