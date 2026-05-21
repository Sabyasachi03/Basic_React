import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import {
  createMasterCountry,
  deleteMasterCountry,
  fetchMasterCountries,
  updateMasterCountry,
} from "@/services/masterApiService";

function CountryMasterPage() {
  const [countries, setCountries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [formValues, setFormValues] = useState({ name: "", code: "", pmName: "" });

  const refresh = async () => {
    const rows = await fetchMasterCountries();
    setCountries(rows);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleDelete = async (id) => {
    const deleted = await deleteMasterCountry(id);
    await refresh();
    toast.success(`Country deleted. isDelete=${deleted.is_delete}`);
  };

  const openAdd = () => {
    setEditingCountry(null);
    setFormValues({ name: "", code: "", pmName: "" });
    setModalOpen(true);
  };

  const openEdit = (country) => {
    setEditingCountry(country);
    setFormValues({
      name: country.name ?? "",
      code: country.code ?? "",
      pmName: country.pm_name ?? "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formValues.name.trim() || !formValues.code.trim() || !formValues.pmName.trim()) {
      toast.error("All fields are required.");
      return;
    }

    const payload = {
      name: formValues.name,
      code: formValues.code,
      pm_name: formValues.pmName,
    };

    if (editingCountry) {
      await updateMasterCountry(editingCountry.id, payload);
      toast.success("Country updated");
    } else {
      await createMasterCountry(payload);
      toast.success("Country added");
    }

    setModalOpen(false);
    setEditingCountry(null);
    setFormValues({ name: "", code: "", pmName: "" });
    await refresh();
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-slate-900">Country Master</h2>

      <div className="mb-4 flex justify-end">
        <Button onClick={openAdd}>Add Country</Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Country Name</th>
              <th className="px-4 py-3">Country Code</th>
              <th className="px-4 py-3">PM Name</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country, index) => (
              <tr key={country.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{country.name}</td>
                <td className="px-4 py-3">{country.code ?? "-"}</td>
                <td className="px-4 py-3">{country.pm_name ?? "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(country)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => void handleDelete(country.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
            {countries.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>No countries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title={editingCountry ? "Edit Country" : "Add Country"} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <Input
            value={formValues.name}
            onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Country name"
          />
          <Input
            value={formValues.code}
            onChange={(e) => setFormValues((prev) => ({ ...prev, code: e.target.value }))}
            placeholder="Country code"
          />
          <Input
            value={formValues.pmName}
            onChange={(e) => setFormValues((prev) => ({ ...prev, pmName: e.target.value }))}
            placeholder="PM name"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => void handleSave()}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CountryMasterPage;
