import { ApiKeyManager } from "@/components/dashboard/api-key-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const usageCards = [
  {
    label: "API requests",
    value: "18,240",
    description: "+4.2% vs last 7 days",
  },
  {
    label: "Tokens used",
    value: "2.9M",
    description: "Capped at 10M tokens",
  },
  {
    label: "Spend",
    value: "$184.12",
    description: "Billing resets on Oct 1",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor your API consumption and manage access keys for the Atlas AI platform.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {usageCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-3xl">{card.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <ApiKeyManager />
      </section>
    </div>
  );
}
