interface FormErrorProps {
    error: string
    fieldName: string
}

export const FormError = ({ error }: FormErrorProps) => {
    if (!error) return null

    return (
        <div className="error-message" style={{
            color: '#dc3545',
            fontSize: '0.875rem',
            marginTop: '4px'
        }}>
            {error}
        </div>
    )
}
