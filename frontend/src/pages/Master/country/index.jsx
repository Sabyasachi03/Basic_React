import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { countryApi } from "@/services/masterApiService";

function CountryMasterPage() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", code: "", pmName: "" });

  const load = async () => setRows(await countryApi.list());
  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    if (!form.name || !form.code || !form.pmName)
      return toast.error("All fields required");
    const payload = { name: form.name, code: form.code, pm_name: form.pmName };
    if (editing) await countryApi.update(editing.id, payload);
    else await countryApi.create(payload);
    setModalOpen(false);
    setEditing(null);
    setForm({ name: "", code: "", pmName: "" });
    await load();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Country Master</h2>
        <Button onClick={() => setModalOpen(true)}>Add Country</Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">PM Name</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.code}</td>
                <td className="px-4 py-3">{r.pm_name}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(r);
                        setForm({
                          name: r.name,
                          code: r.code,
                          pmName: r.pm_name,
                        });
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        const d = await countryApi.remove(r.id);
                        toast.success(
                          `Country deleted. isDelete=${d.is_delete}`,
                        );
                        await load();
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        open={modalOpen}
        title={editing ? "Edit Country" : "Add Country"}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-3">
          <Input
            placeholder="Country name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <Input
            placeholder="Country code"
            value={form.code}
            onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
          />
          <Input
            placeholder="PM name"
            value={form.pmName}
            onChange={(e) => setForm((p) => ({ ...p, pmName: e.target.value }))}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void save()}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CountryMasterPage;
