import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: Variant;
	size?: Size;
	block?: boolean;
};

const base = 'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500';
const sizes: Record<Size, string> = {
	sm: 'px-4 py-2 text-sm',
	md: 'px-6 py-2.5 text-sm',
	lg: 'px-8 py-3 text-base',
};
const variants: Record<Variant, string> = {
	primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg hover:shadow-orange-500/50',
	secondary: 'border-2 border-gray-200 dark:border-gray-800 hover:border-orange-500 text-black dark:text-white bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm',
	ghost: 'text-orange-500 hover:bg-orange-500/10',
};

const Button = forwardRef<HTMLButtonElement, Props>(function Button({ variant = 'primary', size = 'md', block = false, className = '', ...props }, ref) {
	return (
		<button ref={ref} className={`${base} ${sizes[size]} ${variants[variant]} ${block ? 'w-full' : ''} ${className}`} {...props} />
	);
});

export default Button;


