import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { encryptId } from "@/lib/crypto";
import { deleteMasterState, fetchMasterCountries, fetchMasterStates } from "@/services/masterApiService";

function StateMaster() {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [countryMap, setCountryMap] = useState({});

  const refresh = async () => {
    const [rows] = await Promise.all([fetchMasterStates()]);
    setStates(rows);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleDelete = async (id) => {
    const deleted = await deleteMasterState(id);
    await refresh();
    toast.success(`State deleted. isDelete=${deleted.is_delete}`);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">State Master</h2>
        <Button onClick={() => navigate(`/dashboard/states/form/${encryptId(0)}`)}>Add State</Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">State Code</th>
              <th className="px-4 py-3">CM Name</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {states.map((state, index) => (
              <tr key={state.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{state.name}</td>
                <td className="px-4 py-3">{state.code ?? "-"}</td>
                <td className="px-4 py-3">{state.cm_name ?? "-"}</td>
                <td className="px-4 py-3">{state.countryName ?? "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/dashboard/states/form/${encryptId(state.id)}`)}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => void handleDelete(state.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {states.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>No states found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StateMaster;
