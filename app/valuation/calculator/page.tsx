import ValuationCalculatorClient from "@/app/valuation/calculator/calculator-client";
import { getSectorNames } from "@/backend/server/valuation/getComparables";

export default async function ValuationCalculatorPage() {
  const sectors = await getSectorNames();

  return <ValuationCalculatorClient sectors={sectors} />;
}
