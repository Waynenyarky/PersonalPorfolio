import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

type Props = {
	children: ReactNode;
};

export default function Layout({ children }: Props) {
	const mainRef = useRef<HTMLElement>(null);

	useEffect(() => {
		// If URL contains #main-content, focus main
		if (window.location.hash === '#main-content') {
			mainRef.current?.focus();
		}
	}, []);

	return (
		<div>
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-orange-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
			>
				Skip to content
			</a>
			<main id="main-content" ref={mainRef} tabIndex={-1}>
				{children}
			</main>
		</div>
	);
}


