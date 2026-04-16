import { Button } from "@repo/ui/components/button";
import { Link } from "react-router";


export default function Dashboard() {

    return (
    <div className="h-full grid place-content-center gap-6">
      <h1 className="text-headline">Welcome, username</h1>
      <div className="flex justify-center gap-3">
        <Button className="rounded-full" variant="secondary" asChild>
          <Link to="/">Growing</Link>
        </Button>
        <Button className="rounded-full" variant="outline" asChild>
          <Link to="/">Planning</Link>
        </Button>
      </div>
    </div>
    );
}