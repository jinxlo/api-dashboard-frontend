import { PlaygroundPanel } from "@/components/playground/playground-panel";
import { PageHeader } from "@/components/layout/page-header";

export default function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Playground"
        description="Evaluate Atlas language, speech, and vision models side by side before shipping to production."
        docsHref="/docs"
      />
      <PlaygroundPanel />
    </div>
  );
}
