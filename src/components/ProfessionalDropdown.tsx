import { useState, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../theme/useTheme';

type Option = {
  value: string;
  label: string;
};

type ProfessionalDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  inputBg?: string;
  borderBase?: string;
  textPrimary?: string;
  textSecondary?: string;
  leftIcon?: ReactNode;
  'aria-label'?: string;
  required?: boolean;
  name?: string;
};

export default function ProfessionalDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  inputBg = 'bg-white dark:bg-gray-900/50',
  borderBase = 'border-gray-200 dark:border-gray-800',
  textPrimary = 'text-black dark:text-white',
  textSecondary = 'text-gray-600 dark:text-gray-300',
  leftIcon,
  'aria-label': ariaLabel,
  required = false,
  name,
}: ProfessionalDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const bgCard = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderBaseDark = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const textPrimaryDark = theme === 'dark' ? 'text-white' : 'text-black';

  const selectedOption = options.find(opt => opt.value === value);

  // Calculate dropdown position when opening and on scroll/resize
  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        // For fixed positioning, use viewport coordinates directly
        setPosition({
          top: rect.bottom + 4, // 4px gap below button
          left: rect.left,
          width: rect.width,
        });
      }
    };

    if (isOpen) {
      updatePosition();
      // Update position on scroll and resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedDropdown = (event.target as Element)?.closest('[role="listbox"]');
      const clickedButton = buttonRef.current?.contains(target);
      
      if (!clickedButton && !clickedDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Use a slight delay to avoid closing immediately on open
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
      }, 10);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Handle scrollbar visibility on scroll
  useEffect(() => {
    const container = optionsContainerRef.current;
    if (!container || options.length <= 5) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1000); // Hide scrollbar 1 second after scrolling stops
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isOpen, options.length]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Hidden select for form submission */}
      {name && (
        <select
          name={name}
          value={value}
          onChange={() => {}}
          required={required}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-xl ${leftIcon ? 'pl-10' : 'pl-3'} pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-500/50 flex items-center justify-between ${
          isOpen ? 'ring-2 ring-orange-500 border-transparent' : ''
        }`}
        aria-label={ariaLabel}
        {...(isOpen ? { 'aria-expanded': 'true' } : { 'aria-expanded': 'false' })}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {leftIcon && (
            <span className="shrink-0">{leftIcon}</span>
          )}
          <span className={selectedOption ? textPrimary : `${textSecondary} opacity-70`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`dropdown-icon ${textSecondary} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          size={16}
        />
      </button>

      {/* Dropdown Options - Rendered via Portal */}
      {isOpen && typeof window !== 'undefined' && position.width > 0 && createPortal(
        <div
          className={`fixed ${bgCard} border ${borderBaseDark} rounded-xl shadow-2xl overflow-hidden dropdown-container-enter`}
          role="listbox"
          aria-label={ariaLabel || 'Dropdown options'}
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgb(17, 24, 39)' : 'rgb(255, 255, 255)',
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
            minWidth: `${position.width}px`,
            maxWidth: `${position.width}px`,
            zIndex: 999999,
            position: 'fixed',
            display: 'block',
            visibility: 'visible',
            pointerEvents: 'auto',
            transformOrigin: 'top center',
            transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            ref={optionsContainerRef}
            className={`dropdown-options-container ${options.length > 5 ? 'has-scroll' : ''} ${isScrolling ? 'is-scrolling' : ''}`}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  {...(isSelected ? { 'aria-selected': 'true' } : { 'aria-selected': 'false' })}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-4 py-3.5 text-sm transition-all duration-200 border-b ${borderBaseDark} last:border-b-0 dropdown-option ${
                    isSelected
                      ? `${textPrimaryDark} bg-orange-500/15 font-semibold border-l-4 border-orange-500 shadow-sm`
                      : `${textPrimaryDark} hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:shadow-sm`
                  } focus:outline-none focus:bg-orange-500/10 focus:ring-2 focus:ring-orange-500/20`}
                  data-index={index}
                  style={{
                    color: theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
                    backgroundColor: isSelected 
                      ? (theme === 'dark' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(249, 115, 22, 0.15)')
                      : 'transparent'
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex-1 font-medium">{option.label}</span>
                    {isSelected && (
                      <span className="text-orange-500 text-base font-bold shrink-0">✓</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

