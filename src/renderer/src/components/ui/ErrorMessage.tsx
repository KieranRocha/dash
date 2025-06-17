import { Button } from "./Button";

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-800 mb-2">Erro: {message}</p>
        {onRetry && (
            <Button variant="secondary" onClick={onRetry}>
                Tentar Novamente
            </Button>
        )}
    </div>
);
