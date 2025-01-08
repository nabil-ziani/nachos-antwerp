'use client'

import { FormProvider, UseFormReturn, FieldValues } from 'react-hook-form'
import toast from 'react-hot-toast'

interface FormWrapperProps<T extends FieldValues> {
    form: UseFormReturn<T>
    onSubmit: (values: T) => Promise<void>
    children: React.ReactNode
    className?: string
}

export const FormWrapper = <T extends FieldValues>({
    form,
    onSubmit,
    children,
    className = ''
}: FormWrapperProps<T>) => {
    const handleSubmit = async (values: T) => {
        try {
            await onSubmit(values)
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error('Er ging iets mis. Probeer het opnieuw.')
            }
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className={className} noValidate>
                {children}
            </form>
        </FormProvider>
    )
} 