import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: Variant;
	size?: Size;
	block?: boolean;
};

const base = 'font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950';
const sizes: Record<Size, string> = {
	sm: 'px-4 py-2.5 text-sm',
	md: 'px-6 py-3 text-sm',
	lg: 'px-8 py-3.5 text-base',
};
const variants: Record<Variant, string> = {
	primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5',
	secondary: 'border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 text-black dark:text-white bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-md',
	ghost: 'text-orange-500 hover:bg-orange-500/10',
};

const Button = forwardRef<HTMLButtonElement, Props>(function Button({ variant = 'primary', size = 'md', block = false, className = '', ...props }, ref) {
	return (
		<button ref={ref} className={`${base} ${sizes[size]} ${variants[variant]} ${block ? 'w-full' : ''} ${className}`} {...props} />
	);
});

export default Button;


