import EmptyState from "@/components/common/EmptyState";

const METHOD_BADGE_STYLES = {
  GET: "bg-blue-100 text-blue-700 border-blue-200",
  POST: "bg-emerald-100 text-emerald-700 border-emerald-200",
  PUT: "bg-amber-100 text-amber-700 border-amber-200",
  DELETE: "bg-red-100 text-red-700 border-red-200",
};

function formatDate(value) {
  return new Date(value).toLocaleString();
}

function stringifyData(value) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function MethodBadge({ method }) {
  const style = METHOD_BADGE_STYLES[method] ?? "bg-slate-100 text-slate-700 border-slate-200";
  return <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${style}`}>{method}</span>;
}

function ActivityTable({ activities }) {
  if (activities.length === 0) {
    return <EmptyState title="No Activity Yet" description="API operation logs will appear here." />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Method</th>
              <th className="px-4 py-3 font-semibold">Endpoint</th>
              <th className="px-4 py-3 font-semibold">Request Payload</th>
              <th className="px-4 py-3 font-semibold">Response Body</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-t border-slate-100 align-top transition hover:bg-slate-50">
                <td className="px-4 py-3"><MethodBadge method={activity.method} /></td>
                <td className="px-4 py-3 font-medium text-slate-800">{activity.endpoint}</td>
                <td className="px-4 py-3 text-xs text-slate-700">
                  <code className="block max-w-[260px] whitespace-pre-wrap break-words rounded bg-slate-100 px-2 py-1">
                    {stringifyData(activity.requestPayload)}
                  </code>
                </td>
                <td className="px-4 py-3 text-xs text-slate-700">
                  <code className="block max-w-[280px] whitespace-pre-wrap break-words rounded bg-slate-100 px-2 py-1">
                    {stringifyData(activity.responseBody)}
                  </code>
                </td>
                <td className="px-4 py-3 text-slate-700">{activity.status}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(activity.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ActivityTable;