import { PlaygroundPanel } from "@/components/playground/playground-panel";

export default function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Playground</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Evaluate Atlas language, speech, and vision models side by side. Preview outputs with sandbox credentials before
          promoting changes into production.
        </p>
      </div>
      <PlaygroundPanel />
    </div>
  );
}
