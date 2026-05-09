import { Button } from "@repo/ui/components/button";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorUIProps {
	message?: string;
	onRetry: () => void;
}

export function ErrorUI({
	message = "Something went wrong. Please try again.",
	onRetry,
}: ErrorUIProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center px-4">
			<div className="rounded-full bg-destructive/10 p-3">
				<AlertCircle className="size-6 text-destructive" />
			</div>
			<div className="space-y-2">
				<h2 className="text-lg font-semibold">Error</h2>
				<p className="text-muted-foreground max-w-sm">{message}</p>
			</div>
			<Button onClick={onRetry} variant="default" className="mt-4 gap-2">
				<RotateCcw className="size-4" />
				Retry
			</Button>
		</div>
	);
}
