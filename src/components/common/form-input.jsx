import { Input } from '@ui/input';
import { Field, FieldLabel } from '@ui/field';

export const FormInput = ({ label, id, error, children, ...props }) => (
  <Field>
    <FieldLabel htmlFor={id}>{label}</FieldLabel>
    <Input {...props} id={id} />
    {children}
  </Field>
);
