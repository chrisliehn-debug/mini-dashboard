export interface FridgeItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expires_date: string; // ISO date string (YYYY-MM-DD)
  created_at: string; // ISO timestamp string
}

export type ItemStatus = "fresh" | "expiring_soon" | "expired";

export function getItemStatus(expiresAt: string): ItemStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiresAt);
  expiry.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 3) return "expiring_soon";
  return "fresh";
}
