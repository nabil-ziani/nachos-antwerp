'use client'

import { useFormContext } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'

interface Option {
    value: string
    label: string
}

interface FormFieldProps {
    name: string
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date'
    placeholder?: string
    required?: boolean
    options?: Option[]
    rows?: number
    className?: string
}

export const FormField = ({
    name,
    type,
    placeholder,
    required,
    options,
    rows = 4,
    className = ''
}: FormFieldProps) => {
    const { register, formState: { errors } } = useFormContext()
    const error = errors[name]?.message as string

    const baseProps = {
        ...register(name),
        placeholder,
        className: `${error ? 'error' : ''} ${className}`,
        required
    }

    const renderField = () => {
        switch (type) {
            case 'textarea':
                return (
                    <div className="tst-group-input">
                        <textarea
                            {...baseProps}
                            rows={rows}
                        />
                    </div>
                )
            case 'select':
                return (
                    <div className="tst-group-input">
                        <select {...baseProps} className={`${baseProps.className} wide`}>
                            {options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )
            default:
                return (
                    <div className="tst-group-input">
                        <input
                            {...baseProps}
                            type={type}
                        />
                    </div>
                )
        }
    }

    return (
        <>
            {renderField()}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="error-message"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}