'use client'

import { useFormContext } from 'react-hook-form'
import { FormError } from './form-error'

interface Option {
    value: string
    label: string
}

interface FormInputProps {
    name: string
    label?: string
    type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date'
    placeholder?: string
    required?: boolean
    className?: string
    autoComplete?: string
    options?: Option[]
    rows?: number
}

export const FormInput = ({
    name,
    label,
    type = 'text',
    placeholder,
    required = false,
    className = '',
    autoComplete,
    options,
    rows = 4
}: FormInputProps) => {
    const { register, formState: { errors, touchedFields } } = useFormContext()
    const error = errors[name]?.message as string
    const touched = touchedFields[name]

    const renderInput = () => {
        const placeholderWithAsterisk = required ? `${placeholder} *` : placeholder
        const baseClassName = error && touched ? 'error' : ''

        switch (type) {
            case 'textarea':
                return (
                    <textarea
                        {...register(name)}
                        id={name}
                        placeholder={placeholderWithAsterisk}
                        className={baseClassName}
                        rows={rows}
                    />
                )
            case 'select':
                return (
                    <select
                        {...register(name)}
                        id={name}
                        className={`${baseClassName} wide`}
                    >
                        {options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )
            default:
                return (
                    <input
                        {...register(name)}
                        id={name}
                        type={type}
                        placeholder={placeholderWithAsterisk}
                        className={baseClassName}
                        autoComplete={autoComplete}
                    />
                )
        }
    }

    return (
        <div className={`tst-group-input ${className}`} style={{ marginBottom: '20px' }}>
            {renderInput()}
            {error && touched && <FormError error={error} fieldName={name} />}
        </div>
    )
} 