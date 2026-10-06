import { siteConfig } from "@education/config";
import { Button } from "@education/ui";

export default function Home() {
  return (
    <main>
      <h1>{siteConfig.name}</h1>

      <p>
        Education, test preparation, calculators and student
        intelligence.
      </p>

      <Button>
        Explore Tools
      </Button>
    </main>
  );
}