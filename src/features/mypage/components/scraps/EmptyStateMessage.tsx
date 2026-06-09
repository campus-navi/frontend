type EmptyStateMessageProps = {
  message: string;
};

export function EmptyStateMessage({ message }: EmptyStateMessageProps) {
  return (
    <p className="flex min-h-[72px] w-full items-center rounded-2xl bg-[#FAFBFD] px-4 text-sm font-medium leading-[1.4] tracking-normal text-[#8A9199]">
      {message}
    </p>
  );
}
