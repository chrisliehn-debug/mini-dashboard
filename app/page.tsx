import { supabase } from "@/lib/supabase";
import { FridgeItem, getItemStatus } from "@/types/fridge";

async function getFridgeItems(): Promise<FridgeItem[]> {
  const { data, error } = await supabase
    .from("fridge_items")
    .select("*")
    .order("expires_at", { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
    return [];
  }

  return data ?? [];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function StatusBadge({ expiresAt }: { expiresAt: string }) {
  const status = getItemStatus(expiresAt);

  const styles = {
    fresh: "bg-green-100 text-green-800",
    expiring_soon: "bg-yellow-100 text-yellow-800",
    expired: "bg-red-100 text-red-800",
  };

  const labels = {
    fresh: "Frisch",
    expiring_soon: "Bald ablaufend",
    expired: "Abgelaufen",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function TableRowBackground({ status }: { status: "fresh" | "expiring_soon" | "expired" }) {
  const rowStyles = {
    fresh: "bg-white hover:bg-green-50",
    expiring_soon: "bg-yellow-50 hover:bg-yellow-100",
    expired: "bg-red-50 hover:bg-red-100",
  };
  return rowStyles[status];
}

interface KpiCardProps {
  title: string;
  value: number;
  color: "blue" | "yellow" | "red";
}

function KpiCard({ title, value, color }: KpiCardProps) {
  const colorStyles = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };

  const valueStyles = {
    blue: "text-blue-900",
    yellow: "text-yellow-900",
    red: "text-red-900",
  };

  return (
    <div className={`rounded-xl border p-5 ${colorStyles[color]}`}>
      <p className="text-sm font-medium">{title}</p>
      <p className={`mt-2 text-4xl font-bold ${valueStyles[color]}`}>{value}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const items = await getFridgeItems();

  const totalItems = items.length;
  const expiringSoon = items.filter(
    (item) => getItemStatus(item.expires_at) === "expiring_soon"
  ).length;
  const expired = items.filter(
    (item) => getItemStatus(item.expires_at) === "expired"
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* KPI Cards */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Übersicht</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard title="Artikel gesamt" value={totalItems} color="blue" />
          <KpiCard title="Bald ablaufend (≤3 Tage)" value={expiringSoon} color="yellow" />
          <KpiCard title="Abgelaufen" value={expired} color="red" />
        </div>
      </section>

      {/* Items Table */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Alle Einträge
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
            <p className="text-lg">Keine Einträge gefunden.</p>
            <p className="text-sm mt-1">
              Stelle sicher, dass die Supabase-Verbindung konfiguriert ist.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wide">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Kategorie</th>
                  <th className="px-4 py-3">Menge</th>
                  <th className="px-4 py-3">Ablaufdatum</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => {
                  const status = getItemStatus(item.expires_at);
                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${TableRowBackground({ status })}`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.category}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(item.expires_at)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge expiresAt={item.expires_at} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
