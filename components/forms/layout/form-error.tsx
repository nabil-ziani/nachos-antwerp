interface FormErrorProps {
    error: string
    fieldName: string
}

export const FormError = ({ error }: FormErrorProps) => {
    if (!error) return null

    return (
        <div className="invalid-feedback d-block" style={{ textAlign: 'left', marginTop: '4px' }}>
            {error}
        </div>
    )
} 