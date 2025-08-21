import { useForm, UseFormProps } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

interface FormFieldProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string
  error?: string
  description?: string
  required?: boolean
}

export function FormField({
  label,
  error,
  description,
  required,
  children,
  className,
}: FormFieldProps) {
  const id = React.useId()

  return (
    <div className={clsx('space-y-1', className)}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {children}
      {error && (
        <div className="flex items-center gap-x-2 text-sm text-red-600 dark:text-red-400">
          <ExclamationCircleIcon className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm',
          error &&
            'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:text-red-400',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

interface SelectProps extends React.ComponentPropsWithoutRef<'select'> {
  error?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={clsx(
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm',
          error &&
            'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:text-red-400',
          className
        )}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'

interface TextareaProps extends React.ComponentPropsWithoutRef<'textarea'> {
  error?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm',
          error &&
            'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:text-red-400',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

interface CheckboxProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string
  error?: boolean
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className={clsx(
            'h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800',
            error && 'border-red-300 focus:ring-red-500',
            className
          )}
          {...props}
        />
        <label
          htmlFor={props.id}
          className="ml-2 block text-sm text-gray-900 dark:text-gray-100"
        >
          {label}
        </label>
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

// Form hook with Zod validation
export function useZodForm<TSchema extends z.ZodType>(
  schema: TSchema,
  props?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>
) {
  return useForm<z.infer<TSchema>>({
    ...props,
    resolver: zodResolver(schema),
  })
}
