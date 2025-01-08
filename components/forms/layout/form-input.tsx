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
        const inputStyle = error && touched ? { marginBottom: '4px' } : undefined

        switch (type) {
            case 'textarea':
                return (
                    <textarea
                        {...register(name)}
                        id={name}
                        placeholder={placeholderWithAsterisk}
                        className={baseClassName}
                        style={inputStyle}
                        rows={rows}
                    />
                )
            case 'select':
                return (
                    <select
                        {...register(name)}
                        id={name}
                        className={`${baseClassName} wide`}
                        style={inputStyle}
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
                        style={inputStyle}
                        autoComplete={autoComplete}
                    />
                )
        }
    }

    return (
        <>
            <style jsx global>{`
                .tst-group-input input.error,
                .tst-group-input textarea.error,
                .tst-group-input select.error {
                    border-color: #dc3545;
                    box-shadow: 0 0 0 0.1rem rgba(220, 53, 69, 0.25);
                }
            `}</style>
            <div className={`tst-group-input ${className}`} style={{ marginBottom: '20px' }}>
                {renderInput()}
                {error && touched && <FormError error={error} fieldName={name} />}
            </div>
        </>
    )
} 