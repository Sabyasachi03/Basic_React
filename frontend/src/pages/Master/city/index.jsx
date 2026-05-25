import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { encryptId } from "@/lib/crypto";
import { cityApi } from "@/services/masterApiService";

function CityMasterPage() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);

  const load = async () => {
    setRows(await cityApi.list());
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">City Master</h2>
        <Button onClick={() => nav(`/master/city/city-form/${encryptId(0)}`)}>
          Add City
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Mayor</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.code}</td>
                <td className="px-4 py-3">{r.mayor_name}</td>
                <td className="px-4 py-3">{r.country_name ?? "-"}</td>
                <td className="px-4 py-3">{r.state_name ?? "-"}</td>
                <td className="px-4 py-3">{r.district_name ?? "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        nav(`/master/city/city-form/${encryptId(r.id)}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        const d = await cityApi.remove(r.id);
                        toast.success(`City deleted. isDelete=${d.is_delete}`);
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
    </div>
  );
}

export default CityMasterPage;
