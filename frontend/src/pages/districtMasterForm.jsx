import { useEffect, useRef, useState } from "react";
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
  createMasterDistrict,
  fetchMasterCountries,
  fetchMasterDistrictById,
  fetchMasterStates,
  updateMasterDistrict,
} from "@/services/masterApiService";

const schema = z.object({
  name: z.string().min(2, "District name is required"),
  code: z.string().min(1, "District code is required"),
  dmName: z.string().min(2, "DM name is required"),
  countryId: z.coerce.number().int().positive("Country is required"),
  stateId: z.coerce.number().int().positive("State is required"),
});

function DistrictMasterForm() {
  const navigate = useNavigate();
  const { encryptedId } = useParams();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(0);
  const isInitializingRef = useRef(false);
  const decodedId = encryptedId ? decryptId(encryptedId) : null;
  const isAddMode = decodedId === 0;
  const editingId = decodedId && decodedId > 0 ? decodedId : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", code: "", dmName: "", countryId: 0, stateId: 0 },
  });

  const watchedCountryId = watch("countryId");

  useEffect(() => {
    const loadCountries = async () => {
      const rows = await fetchMasterCountries();
      setCountries(rows);
    };

    const load = async () => {
      if (!encryptedId || isAddMode) return;
      if (decodedId === null) {
        toast.error("Invalid district id");
        navigate("/dashboard/districts");
        return;
      }

      if (!editingId) return;
      try {
        isInitializingRef.current = true;
        const district = await fetchMasterDistrictById(editingId);
        const countryId = district.country_id ?? 0;
        const stateId = district.state_id ?? 0;
        const stateRows = countryId ? await fetchMasterStates(countryId) : [];

        setSelectedCountryId(district.country_id ?? 0);
        setStates(stateRows);
        reset({
          name: district.name ?? "",
          code: district.code ?? "",
          dmName: district.dm_name ?? "",
          countryId,
          stateId,
        });
      } catch {
        toast.error("District not found");
        navigate("/dashboard/districts");
      } finally {
        isInitializingRef.current = false;
      }
    };

    void loadCountries();
    void load();
  }, [decodedId, editingId, encryptedId, isAddMode, navigate, reset]);

  useEffect(() => {
    const countryId = Number(watchedCountryId || 0);
    setSelectedCountryId(countryId);

    const loadStates = async () => {
      if (!countryId) {
        setStates([]);
        setValue("stateId", 0);
        return;
      }

      const rows = await fetchMasterStates(countryId);
      setStates(rows);

      if (isInitializingRef.current) return;

      const selectedStateStillValid = rows.some((state) => state.id === Number(getValues("stateId")));
      if (!selectedStateStillValid) {
        setValue("stateId", 0);
      }
    };

    void loadStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedCountryId, setValue]);

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      code: values.code,
      dm_name: values.dmName,
      country_id: values.countryId,
      state_id: values.stateId,
    };

    try {
      if (editingId) {
        await updateMasterDistrict(editingId, payload);
        toast.success("District updated");
      } else {
        await createMasterDistrict(payload);
        toast.success("District added");
      }

      navigate("/dashboard/districts");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Unable to save district");
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">{editingId ? "Edit District" : "Add District"}</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="district-name">District Name</Label>
          <Input id="district-name" {...register("name")} />
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
          <Label htmlFor="state-id">State</Label>
          <select
            id="state-id"
            disabled={!selectedCountryId}
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
            {...register("stateId")}
          >
            <option value={0}>{selectedCountryId ? "Select state" : "Select country first"}</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.stateId && <p className="text-xs text-red-600">{errors.stateId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="district-code">District Code</Label>
          <Input id="district-code" {...register("code")} />
          {errors.code && <p className="text-xs text-red-600">{errors.code.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dm-name">DM Name</Label>
          <Input id="dm-name" {...register("dmName")} />
          {errors.dmName && <p className="text-xs text-red-600">{errors.dmName.message}</p>}
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>{editingId ? "Update" : "Create"}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/dashboard/districts")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

export default DistrictMasterForm;
