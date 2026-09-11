import { Product, Case, ResolutionOption } from "@/types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    brand: "boAt",
    productName: "Airdopes 141",
    purchaseSource: "Amazon",
    purchaseDate: "2026-05-12",
    warrantyExpiry: "2027-05-12",
    warrantyStatus: "Active",
    orderId: "AMZ-99482711-X",
  },
  {
    id: "prod_2",
    brand: "Sony",
    productName: "WH-1000XM5",
    purchaseSource: "Sony Store",
    purchaseDate: "2025-11-20",
    warrantyExpiry: "2026-11-20",
    warrantyStatus: "Active",
    orderId: "SNY-109248",
  },
];

export const MOCK_RESOLUTION_OPTIONS: ResolutionOption[] = [
  {
    id: "opt_amazon",
    provider: "Amazon",
    action: "Replacement",
    cost: 0,
    estimatedDaysMin: 3,
    estimatedDaysMax: 5,
    successProbability: 95,
    customerEffort: "Low",
    eligible: true,
    score: 92,
    isRecommended: true,
    reasonForRecommendation: "Eligible, fastest resolution, zero cost, and low effort.",
  },
  {
    id: "opt_manufacturer",
    provider: "boAt",
    action: "Manufacturer Replacement",
    cost: 0,
    estimatedDaysMin: 5,
    estimatedDaysMax: 7,
    successProbability: 90,
    customerEffort: "Medium",
    eligible: true,
    score: 85,
    isRecommended: false,
  },
  {
    id: "opt_repair",
    provider: "Service Network",
    action: "Paid Repair",
    cost: 500,
    estimatedDaysMin: 7,
    estimatedDaysMax: 10,
    successProbability: 99,
    customerEffort: "High",
    eligible: true,
    score: 65,
    isRecommended: false,
  },
];

export const MOCK_CASES: Case[] = [
  {
    id: "case_1",
    productId: "prod_1",
    originalGoal: "Get my earbuds working again",
    issueDescription: "Right-side crackling audio",
    stage: "DRAFT",
    evidence: [
      {
        id: "ev_1",
        type: "INVOICE",
        fileUrl: "/mock/invoice.pdf",
        name: "amazon_invoice_boat.pdf",
      },
    ],
    resolutionOptions: [],
    attempts: [],
    monitoringEvents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
