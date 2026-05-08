import { Link } from "react-router";
import { Button } from "@repo/ui/components/button";

interface LocationCardProps {
    location: string;
}

export function LocationCard({ location }: LocationCardProps) {

    return (
        <>
        <div className="flex-1 flex flex-col items-start p-6 gap-4">
          <h2>{location || "London, UK"} – Spring</h2>
          <p>
            Spring in {location || "London"} is a wonderful time for
            gardening!
          </p>
          <Button
            className="rounded-full bg-accent2"
            variant="secondary"
            asChild
          >
            <Link to="/settings">Change location</Link>
          </Button>
        </div>
            </>
        );
}

