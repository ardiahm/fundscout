import { notFound } from "next/navigation"
import InvestorClient from "./InvestorClient"

import { getInvestorByIdComplete } from "../../../backend/server/investors/getInvestorByIdComplete"
import { InvestorComplete } from "../../../backend/types/investor"

interface PageProps {
  params: { id: string }
}

function assertExists<T>(value: T | null | undefined): asserts value is T {
  if (value == null) notFound()
}

export default async function InvestorPage({ params }: PageProps) {

  const {id} = await params
  const investorId = Number(id)
  if (Number.isNaN(investorId)) notFound()

  const investor: InvestorComplete | null =
    await getInvestorByIdComplete(investorId)

  assertExists(investor)

  return <InvestorClient investor={investor} />
}
