import type { CallerRecord, CallerReport } from "./types.js";

const now = new Date().toISOString();

export const testRecords: CallerRecord[] = [
  { phone: "+919876512345", displayName: "TEST DATA · Rahul Sharma", category: "Personal", spamScore: 0, verifiedBusiness: false, sourceKind: "TEST_DATA", sourceName: "Local development seed", isTestData: true, updatedAt: now },
  { phone: "+919988777665", displayName: "TEST DATA · Delivery Service", category: "Delivery", spamScore: 12, verifiedBusiness: true, sourceKind: "TEST_DATA", sourceName: "Local development seed", isTestData: true, updatedAt: now },
  { phone: "+919123456789", displayName: "TEST DATA · Reported caller", category: "Unknown", spamScore: 92, verifiedBusiness: false, sourceKind: "TEST_DATA", sourceName: "Local development seed", isTestData: true, updatedAt: now }
];

export const reports: CallerReport[] = [];
