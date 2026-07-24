import { Field, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';

export const FormInput = ({ label, id, error, children, ...props }) => (
  <Field>
    <FieldLabel htmlFor={id}>{label}</FieldLabel>
    <Input {...props} id={id} />
    {children}
  </Field>
);
