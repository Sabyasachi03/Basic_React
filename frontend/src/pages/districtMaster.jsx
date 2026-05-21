import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { encryptId } from "@/lib/crypto";
import { deleteMasterDistrict, fetchMasterDistricts } from "@/services/masterApiService";

function DistrictMaster() {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);

  const refresh = async () => {
    const rows = await fetchMasterDistricts();
    setDistricts(rows);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleDelete = async (id) => {
    const deleted = await deleteMasterDistrict(id);
    await refresh();
    toast.success(`District deleted. isDelete=${deleted.is_delete}`);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">District Master</h2>
        <Button onClick={() => navigate(`/dashboard/districts/form/${encryptId(0)}`)}>Add District</Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">District Code</th>
              <th className="px-4 py-3">DM Name</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {districts.map((district, index) => (
              <tr key={district.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{district.name}</td>
                <td className="px-4 py-3">{district.code ?? "-"}</td>
                <td className="px-4 py-3">{district.dm_name ?? "-"}</td>
                <td className="px-4 py-3">{district.country_name ?? "-"}</td>
                <td className="px-4 py-3">{district.state_name ?? "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/dashboard/districts/form/${encryptId(district.id)}`)}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => void handleDelete(district.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {districts.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={7}>No districts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DistrictMaster;