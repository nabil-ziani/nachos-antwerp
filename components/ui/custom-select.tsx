import { useState, useRef, useEffect } from 'react'

interface Option {
    value: string
    label: string
    disabled?: boolean
}

interface CustomSelectProps {
    value: string
    onChange: (value: string) => void
    options: Option[]
    placeholder?: string
    disabled?: boolean
    className?: string
    testId?: string
}

export function CustomSelect({
    value,
    onChange,
    options,
    placeholder = 'Select an option',
    disabled = false,
    className = '',
    testId = 'custom-select'
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find(opt => opt.value === value)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            window.addEventListener('click', handleClickOutside, true)
        }

        return () => {
            window.removeEventListener('click', handleClickOutside, true)
        }
    }, [isOpen])

    const handleSelectClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div
            ref={selectRef}
            className={`tst-custom-select ${className} ${disabled ? 'disabled' : ''}`}
            onClick={handleSelectClick}
            data-testid={testId}
        >
            <button
                type="button"
                className={`tst-select-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <span>{selectedOption?.label || placeholder}</span>
                <i className="fas fa-chevron-down"></i>
            </button>

            {isOpen && (
                <div className="tst-select-dropdown">
                    {options.map((option, idx) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`tst-select-option ${value === option.value ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}`}
                            onClick={() => {
                                if (!option.disabled) {
                                    onChange(option.value)
                                    setIsOpen(false)
                                }
                            }}
                            disabled={option.disabled}
                            data-testid={`option-${option.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
} 