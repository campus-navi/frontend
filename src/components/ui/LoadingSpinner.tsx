type LoadingSpinnerProps = {
  ariaLabel: string;
  className?: string;
};

export function LoadingSpinner({ ariaLabel, className = 'h-4 w-4' }: LoadingSpinnerProps) {
  return (
    <span
      aria-label={ariaLabel}
      className={[
        'inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70',
        className,
      ].join(' ')}
      role="status"
    />
  );
}
