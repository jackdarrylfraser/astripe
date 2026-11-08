import { clerkClient } from "@clerk/astro/server";

type BillingClient = ReturnType<typeof clerkClient>["billing"];

export async function getPublicUserPlans(billing: Pick<BillingClient, "getPlanList">) {
  const plans = [];
  const limit = 100;
  let offset = 0;
  let totalCount: number;

  do {
    const page = await billing.getPlanList({ payerType: "user", limit, offset });
    plans.push(...page.data.filter((plan) => plan.publiclyVisible && plan.forPayerType === "user"));
    offset += page.data.length;
    totalCount = page.totalCount;
    if (page.data.length === 0 && offset < totalCount) {
      throw new Error("Clerk returned an incomplete list of billing plans.");
    }
  } while (offset < totalCount);

  return plans;
}
