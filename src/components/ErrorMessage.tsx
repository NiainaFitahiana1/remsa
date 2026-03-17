interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center text-destructive">
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}