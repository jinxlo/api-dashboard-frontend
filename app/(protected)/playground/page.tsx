import { PlaygroundPanel } from "@/components/playground/playground-panel";

export default function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Playground</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Experiment with the Atlas large language model using a dedicated evaluation key that does not count against your
          production usage.
        </p>
      </div>
      <PlaygroundPanel />
    </div>
  );
}
