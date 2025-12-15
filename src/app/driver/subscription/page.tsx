import { Check, Star } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: 'Starter',
        price: 49,
        description: 'For part-time drivers getting started on the platform.',
        features: [
            'Accept up to 50 rides per month',
            'Standard support',
            'Keep 100% of your fares',
        ],
        isCurrent: false,
    },
    {
        name: 'Pro',
        price: 79,
        description: 'For full-time drivers who want unlimited access.',
        features: [
            'Unlimited rides',
            'Priority support',
            'Keep 100% of your fares',
            'Advanced analytics',
        ],
        isCurrent: true,
        isRecommended: true,
    }
]

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Subscription"
        description="Choose a plan to stay online and receive ride requests. Drivers keep 100% of their fares."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
            <Card key={plan.name} className={cn("flex flex-col", plan.isRecommended && "border-primary border-2")}>
                {plan.isRecommended && (
                    <div className="flex items-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                        <Star className="size-4 fill-current"/>
                        <span>Most Popular</span>
                    </div>
                )}
                <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">€{plan.price}</span>
                        <span className="text-muted-foreground">/ month</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <p className="font-semibold">What&apos;s included:</p>
                    <ul className="space-y-2">
                       {plan.features.map(feature => (
                         <li key={feature} className="flex items-center gap-2">
                           <Check className="size-4 text-green-500" />
                           <span className="text-muted-foreground">{feature}</span>
                         </li>
                       ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled={plan.isCurrent}>
                        {plan.isCurrent ? 'Current Plan' : 'Choose Plan'}
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
