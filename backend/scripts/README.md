# FundScout - How to add data via addData.ts

This repository uses a **safe, idempotent ad-hoc script** (`scripts/addData.ts`) to add real-world investors, companies, sectors, and investments without touching `seed.ts`.

This guide is written so future-you (or a teammate) can confidently add **complete, high-quality data** without breaking anything.

---

## Purpose of `addData.ts`

This script is designed to:

- Add **real investors, companies, sectors, and investments**
- Be **safe to re-run** (no duplicates)
- Keep `prisma/seed.ts` **clean and untouched**
- Support incremental growth of the FundScout dataset

Always use this script for real-world data.

---

## Prerequisites

Before running or editing the script:

1. **Postgres running**

   ```bash
   docker compose up -d
   docker ps
   ```

2. **Prisma client generated**

    ```bash
    npx prisma generate
    ```

3. **Database status**

    ```bash
    npx prisma migrate status
    ```

4. **TO FINALLY RUN backend script**
    From backend dir:

    ```bash
    npx tsx scripts/addData.ts
    ```

## Script Structure (ORDER-DEPENDENT)

addData.ts follows this strict sequence, read below to see how to add data:

1. **Investors**

    Template:

    ```javascript
    const investorName = await getOrCreateInvestor({
        name: "Investor Name",
        type: "Investor Type (VC, Accel., etc)",
        websiteUrl: "https://investorUrl",
        avatarUrl: "https://logoUrl",
    });
    ```

2. **Companies**

    Template:

    ```javascript
    const companyName = await getOrCreateCompany({
        name: "Company Name",
        description: "one-sentence, factual description",
        websiteUrl: "https://investorUrl",
        location: "City, Country",
        logoUrl: "https://logoUrl",
    });
    ```

3. **Sectors**

    Each copany must have at least one sector. Add sectors immediately after the company is created.

    Template:

    ```javascript
    await addSectorToCompany(companyName.id, "Fintech");
    await addSectorToCompany(companyName.id, "Fintech");
    ```

4. **Invesments**

    This defines the relationship between investors and companies. Remember, date must be entered in format: YYYY-MM-DD

    Template:

    ```javascript
    await createInvestment({
    investorId: investorName.id,
    companyId: companyName.id,
    stage: "Investment Stage",
    amount: 5000000,
    investedAt: new Date("2018-06-01")
     });
     ```

## Recommended data entry workflow

1. **Add Investor**
2. **Add Company**
3. **Attach Sectors**
4. **Create Investment**

## Complete entry template

```javascript
// Investor
const accel = await getOrCreateInvestor({
  name: "Accel",
  type: "Venture Capital",
  websiteUrl: "https://www.accel.com"
});

// Company
const canva = await getOrCreateCompany({
  name: "Canva",
  description: "Online design and visual communication platform",
  websiteUrl: "https://www.canva.com",
  location: "Sydney, Australia"
});

// Sectors
await addSectorToCompany(canva.id, "Design");
await addSectorToCompany(canva.id, "SaaS");

// Investment
await createInvestment({
  investorId: accel.id,
  companyId: canva.id,
  stage: "Series A",
  amount: 3000000,
  investedAt: new Date("2013-01-01")
});
```
