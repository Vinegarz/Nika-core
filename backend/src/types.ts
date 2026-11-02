export type SourceKind =
  | "TEST_DATA"
  | "COMMUNITY"
  | "BUSINESS_DIRECTORY"
  | "LICENSED_PROVIDER"
  | "CNAP";

export type ReportKind = "spam" | "not_spam" | "wrong_name";

export interface CallerRecord {
  phone: string;
  displayName: string;
  category?: string;
  spamScore: number;
  verifiedBusiness: boolean;
  sourceKind: SourceKind;
  sourceName: string;
  isTestData: boolean;
  updatedAt: string;
}

export interface CallerReport {
  phone: string;
  kind: ReportKind;
  comment?: string;
  createdAt: string;
}
