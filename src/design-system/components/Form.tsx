import React from 'react';
import { useForm, UseFormReturn, FieldValues, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { clsx } from 'clsx';
import { Button, Input, Select } from './index';

// Form Schema Builder
export function createFormSchema<T extends Record<string, any>>(schema: z.ZodSchema<T>) {
  return schema;
}

// Form Field Props
interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ name, label, description, required, error, children, className }: FormFieldProps) {
  return (
    <div className={clsx('space-y-2', className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-[var(--color-text)]">
          {label}
          {required && <span className="text-[var(--color-danger-500)] ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-[var(--color-danger-600)]">{error}</p>
      )}
    </div>
  );
}

// Form Input Component
interface FormInputProps extends Omit<React.ComponentProps<typeof Input>, 'name'> {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}

export function FormInput({ name, label, description, required, ...props }: FormInputProps) {
  return (
    <FormField name={name} label={label} description={description} required={required}>
      <Input name={name} {...props} />
    </FormField>
  );
}

// Form Select Component
interface FormSelectProps extends Omit<React.ComponentProps<typeof Select>, 'name'> {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

export function FormSelect({ name, label, description, required, options, ...props }: FormSelectProps) {
  return (
    <FormField name={name} label={label} description={description} required={required}>
      <Select name={name} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FormField>
  );
}

// Form Textarea Component
interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}

export function FormTextarea({ name, label, description, required, className, ...props }: FormTextareaProps) {
  return (
    <FormField name={name} label={label} description={description} required={required}>
      <textarea
        name={name}
        className={clsx(
          'w-full rounded-md border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text)]',
          'focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] text-sm',
          'resize-vertical min-h-[100px]',
          className
        )}
        {...props}
      />
    </FormField>
  );
}

// Form Checkbox Component
interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}

export function FormCheckbox({ name, label, description, required, className, ...props }: FormCheckboxProps) {
  return (
    <FormField name={name} label={label} description={description} required={required}>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name={name}
          className={clsx(
            'h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary-600)]',
            'focus:ring-[var(--color-primary-500)]',
            className
          )}
          {...props}
        />
        {label && (
          <label htmlFor={name} className="text-sm text-[var(--color-text)]">
            {label}
          </label>
        )}
      </div>
    </FormField>
  );
}

// Main Form Component
interface FormProps<T extends FieldValues> {
  schema?: z.ZodSchema<T>;
  defaultValues?: Partial<T>;
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode | ((form: UseFormReturn<T>) => React.ReactNode);
  className?: string;
  submitLabel?: string;
  loading?: boolean;
}

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  submitLabel = 'Submit',
  loading = false,
}: FormProps<T>) {
  const form = useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit} className={clsx('space-y-6', className)}>
      {typeof children === 'function' ? children(form) : children}
      
      <div className="flex justify-end space-x-3">
        <Button
          type="submit"
          loading={loading}
          disabled={loading || !form.formState.isValid}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

// Form Controller Wrapper
interface FormControllerProps {
  name: string;
  control: any;
  render: (props: { field: any; fieldState: any }) => React.ReactNode;
}

export function FormController({ name, control, render }: FormControllerProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={render}
    />
  );
}

// Form Section Component
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={clsx('space-y-4', className)}>
      {(title || description) && (
        <div className="border-b border-[var(--color-border)] pb-4">
          {title && (
            <h3 className="text-lg font-medium text-[var(--color-text)]">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
