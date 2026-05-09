import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";

function formatDate(value) {
  return new Date(value).toLocaleString();
}

function formatBudget(value) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}

function CartTable({ items, onView, onEdit, onDelete, editingItemLoadingId }) {
  if (items.length === 0) {
    return <EmptyState title="No Cart Items" description="Create a new cart item for this country to get started." />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Cart Name</th>
              <th className="px-4 py-3 font-semibold">Country</th>
              <th className="px-4 py-3 font-semibold">Budget</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 font-semibold">Updated</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 transition hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{item.cartName}</td>
                <td className="px-4 py-3 text-slate-700">{item.country}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{formatBudget(item.budget)}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(item.createdAt)}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(item.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={() => onView(item)}>
                      <Eye className="h-4 w-4" /> View
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                      disabled={editingItemLoadingId === item.id}
                    >
                      <Pencil className="h-4 w-4" />
                      {editingItemLoadingId === item.id ? "Loading..." : "Edit"}
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(item)}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CartTable;
