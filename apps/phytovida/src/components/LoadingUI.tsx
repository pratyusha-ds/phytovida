import { Spinner } from "@repo/ui/components/spinner";

interface LoadingUIProps {
	message?: string;
}

export function LoadingUI({ message = "Loading..." }: LoadingUIProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
			<Spinner className="size-8" />
			<p className="text-muted-foreground">{message}</p>
		</div>
	);
}
