//-Path: "TeaChoco-Hospital/client/src/components/custom/Select.tsx"
import { FaChevronDown } from 'react-icons/fa6';
import { useState, useRef, useEffect, useMemo } from 'react';

interface SelectOptionProps {
    value: any;
    label?: string;
    selected?: boolean;
    className?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    children?: React.ReactNode;
}

function SelectOption({
    icon,
    label,
    value,
    onClick,
    selected,
    children,
    className,
}: SelectOptionProps) {
    const content = children || label || value;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full px-5 py-3.5 text-left transition-all flex items-center gap-3 hover:bg-primary/5 dark:hover:bg-primary/10 group ${
                selected
                    ? 'bg-primary/10 text-primary font-black'
                    : 'text-text-light dark:text-text-dark hover:pl-6'
            } ${className}`}>
            {icon && (
                <span
                    className={`transition-transform duration-300 group-hover:scale-110 ${
                        selected
                            ? 'text-primary'
                            : 'text-text-muted-light dark:text-text-muted-dark'
                    }`}>
                    {icon}
                </span>
            )}
            <span className="text-sm tracking-tight">{content}</span>
        </button>
    );
}

export interface OptionSelectType {
    value: any;
    label: string;
    icon?: React.ReactNode;
}

export interface SelectProps {
    label?: string;
    required?: boolean;
    className?: string;
    icon?: React.ReactNode;
    value?: string | number;
    labelClassName?: string;
    placeholder?: string;
    options: OptionSelectType[];
    containerClassName?: string;
    onChange?: (event: { target: { value: any } }) => void;
    children?: (Option: typeof SelectOption, options: OptionSelectType[]) => React.ReactNode;
}

export default function Select({
    icon,
    label,
    value,
    options,
    required,
    children,
    onChange,
    className,
    placeholder,
    labelClassName,
    containerClassName,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = useMemo(() => {
        let option = options.find((option) => option.value === value);
        children?.(
            ({
                icon: optionIcon,
                value: optionValue,
                label: optionLabel,
                children: optionChildren,
            }: SelectOptionProps) => {
                if (optionValue === value) {
                    option = {
                        icon: optionIcon,
                        value: optionValue,
                        label: (optionLabel ??
                            (typeof optionChildren === 'string' ? optionChildren : '')) as string,
                    };
                }
                return <></>;
            },
            options,
        );
        return option;
    }, [children, options, value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: any) => {
        if (onChange) onChange({ target: { value: optionValue } });
        setIsOpen(false);
    };

    const displayText =
        selectedOption?.label || selectedOption?.value || placeholder || label || 'Select...';
    const labelClass = 'flex gap-2 text-sm font-bold text-text-light dark:text-text-dark mb-2 ml-1';
    const triggerClass =
        'w-full px-5 py-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 text-left shadow-sm hover:shadow-md';

    return (
        <div ref={dropdownRef} className={`relative ${containerClassName || ''}`}>
            {label && (
                <label className={`${labelClass} ${labelClassName || ''}`}>
                    {icon && <span className="text-primary/70">{icon}</span>}
                    {label}
                    {required && <span className="text-red-500 font-black">*</span>}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`${triggerClass} ${className || ''} ${
                    isOpen
                        ? 'border-primary ring-4 ring-primary/10 bg-white dark:bg-slate-800'
                        : 'border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark'
                }`}>
                <div className="flex items-center gap-3 truncate">
                    {(selectedOption?.icon || icon) && (
                        <span className="text-primary shrink-0">
                            {selectedOption?.icon || icon}
                        </span>
                    )}
                    <span
                        className={`text-sm font-medium truncate ${
                            selectedOption
                                ? 'text-text-light dark:text-text-dark'
                                : 'text-text-muted-light dark:text-text-muted-dark'
                        }`}>
                        {displayText}
                    </span>
                </div>
                <FaChevronDown
                    className={`w-3.5 h-3.5 text-text-muted-light dark:text-text-muted-dark transition-transform duration-500 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-100 mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden py-2 animate-in fade-in zoom-in duration-200 origin-top">
                    {children
                        ? children(
                              ({ value: optionValue, selected, ...optionProps }: any) => (
                                  <SelectOption
                                      {...optionProps}
                                      value={optionValue}
                                      selected={selected || value === optionValue}
                                      onClick={() => handleSelect(optionValue)}
                                  />
                              ),
                              options,
                          )
                        : options.map((option) => (
                              <SelectOption
                                  key={option.value}
                                  {...option}
                                  selected={value === option.value}
                                  onClick={() => handleSelect(option.value)}
                              />
                          ))}
                </div>
            )}
        </div>
    );
}
