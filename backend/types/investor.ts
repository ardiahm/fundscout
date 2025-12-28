export type InvestorSummary = {
  id: number;
  name: string;
  type: string;
  avatarUrl?: string | null;
  websiteUrl?: string | null;

  totalInvestments: number;
  averageInvestmentSize: number | null;

  mostRecentInvestmentCompany: string | null;
  mostRecentInvestmentDate: Date | null;
};

export type InvestorWithDetails = {
  id: number;
  name: string;
  type: string;
  avatarUrl: string | null;
  websiteUrl: string | null;
  investments: {
    id: number;
    amount: number | null;
    stage: string | null;
    investedAt: Date | null;
    company: {
      id: number;
      name: string;
      websiteUrl: string | null;
      description: string | null;
      logoUrl: string | null;
      location: string | null;
      sectors: {
        id: number;
        sectorId: number;
        companyId: number;
        sector: {
          id: number;
          name: string;
        };
      }[];
    };
  }[];
} | null;

type InvestorBase = {
  id: number;
  name: string;
  type: string;
  avatarUrl?: string | null;
  websiteUrl?: string | null;
};

type InvestorDetails = InvestorBase & {
  investments: {
    id: number;
    amount: number | null;
    stage: string | null;
    investedAt: Date | null;
    company: {
      id: number;
      name: string;
      websiteUrl: string | null;
      description: string | null;
      logoUrl: string | null;
      location: string | null;
      sectors: {
        id: number;
        sectorId: number;
        companyId: number;
        sector: {
          id: number;
          name: string;
        };
      }[];
    };
  }[];
};

export type InvestorComplete = InvestorDetails & {
  totalInvestments: number;
  averageInvestmentSize: number | null;
  mostRecentInvestmentCompany: string | null;
  mostRecentInvestmentDate: Date | null;
};
