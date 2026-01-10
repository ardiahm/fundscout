import dotenv from "dotenv"
import { prisma } from "../../lib/prisma"
import {getInvestorsComplete} from "../investors/getInvestorComplete";


export async function getFavoriteInvestorsByUserID(userId: string) {
  return getInvestorsComplete(userId, true)
}