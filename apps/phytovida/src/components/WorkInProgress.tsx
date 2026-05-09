import { Lightbulb } from "lucide-react";
import {
	Empty,
	EmptyHeader,
	EmptyTitle,
	EmptyDescription,
	EmptyMedia,
} from "@repo/ui/components/empty";

interface WorkInProgressProps {
	title?: string;
	description?: string;
}

export function WorkInProgress({
	title = "Coming Soon",
	description = "This feature is currently being developed. Check back soon!",
}: WorkInProgressProps) {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Lightbulb className="text-muted-foreground" />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
