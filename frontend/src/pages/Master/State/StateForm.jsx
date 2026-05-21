import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { decryptId } from "@/lib/crypto";
import {
  createMasterState,
  fetchMasterCountries,
  fetchMasterStateById,
  updateMasterState,
} from "@/services/masterApiService";

const schema = z.object({
  name: z.string().min(2, "State name is required"),
  code: z.string().min(1, "State code is required"),
  cmName: z.string().min(2, "CM name is required"),
  countryId: z.coerce.number().int().positive("Country is required"),
});

function StateMasterForm() {
  const navigate = useNavigate();
  const { encryptedId } = useParams();
  const [countries, setCountries] = useState([]);
  const decodedId = encryptedId ? decryptId(encryptedId) : null;
  const isAddMode = decodedId === 0;
  const editingId = decodedId && decodedId > 0 ? decodedId : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", code: "", cmName: "", countryId: 0 },
  });

  useEffect(() => {
    const loadCountries = async () => {
      const rows = await fetchMasterCountries();
      setCountries(rows);
    };

    const load = async () => {
      if (!encryptedId || isAddMode) return;
      if (decodedId === null) {
        toast.error("Invalid state id");
        navigate("/dashboard/states");
        return;
      }

      if (!editingId) return;
      try {
        const state = await fetchMasterStateById(editingId);
        reset({
          name: state.name ?? "",
          code: state.code ?? "",
          cmName: state.cm_name ?? "",
          countryId: state.country_id ?? 0,
        });
      } catch {
        toast.error("State not found");
        navigate("/dashboard/states");
      }
    };

    void loadCountries();
    void load();
  }, [decodedId, editingId, encryptedId, isAddMode, navigate, reset]);

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      code: values.code,
      cm_name: values.cmName,
      country_id: values.countryId,
    };

    try {
      if (editingId) {
        await updateMasterState(editingId, payload);
        toast.success("State updated");
      } else {
        await createMasterState(payload);
        toast.success("State added");
      }

      navigate("/dashboard/states");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Unable to save state");
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">{editingId ? "Edit State" : "Add State"}</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="state-name">State Name</Label>
          <Input id="state-name" {...register("name")} />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country-id">Country</Label>
          <select
            id="country-id"
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            {...register("countryId")}
          >
            <option value={0}>Select country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.countryId && <p className="text-xs text-red-600">{errors.countryId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state-code">State Code</Label>
          <Input id="state-code" {...register("code")} />
          {errors.code && <p className="text-xs text-red-600">{errors.code.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cm-name">CM Name</Label>
          <Input id="cm-name" {...register("cmName")} />
          {errors.cmName && <p className="text-xs text-red-600">{errors.cmName.message}</p>}
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>{editingId ? "Update" : "Create"}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/dashboard/states")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

export default StateMasterForm;