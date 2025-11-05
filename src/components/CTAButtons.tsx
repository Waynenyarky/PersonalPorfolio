import Button from './Button';

type Props = {
	onPrimary: () => void;
	onSecondary: () => void;
	primaryText: string;
	secondaryText: string;
	borderBaseClass: string;
	textPrimaryClass: string;
};

export default function CTAButtons({ onPrimary, onSecondary, primaryText, secondaryText, borderBaseClass, textPrimaryClass }: Props) {
	return (
		<div className="flex flex-wrap justify-center gap-3 sm:gap-4">
			<Button onClick={onPrimary} variant="primary" size="md">{primaryText}</Button>
			<Button onClick={onSecondary} variant="secondary" size="md" className={`${borderBaseClass} ${textPrimaryClass}`}>{secondaryText}</Button>
		</div>
	);
}


