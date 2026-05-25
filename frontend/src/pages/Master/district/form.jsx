import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { decryptId } from "@/lib/crypto";
import { countryApi, districtApi, stateApi } from "@/services/masterApiService";

const schema = z.object({
  name: z.string().min(2),
  code: z.string().min(1),
  dmName: z.string().min(2),
  countryId: z.coerce.number().int().positive(),
  stateId: z.coerce.number().int().positive(),
});

function DistrictMasterFormPage() {
  const nav = useNavigate();
  const { encryptedId } = useParams();
  const id = decryptId(encryptedId);
  const isEdit = id > 0;

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loadedCountryId, setLoadedCountryId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", code: "", dmName: "", countryId: 0, stateId: 0 },
  });

  const countryId = watch("countryId");

  useEffect(() => {
    void countryApi.list().then(setCountries);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (Number(countryId) === loadedCountryId) return;
      if (!countryId || countryId === "0") {
        setStates([]);
        setValue("stateId", 0);
        setLoadedCountryId(null);
        return;
      }
      const s = await stateApi.list(Number(countryId));
      setStates(s);
      setLoadedCountryId(Number(countryId));
    };
    void load();
  }, [countryId, loadedCountryId, setValue]);

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      const d = await districtApi.getById(id);
      const s = await stateApi.list(d.country_id);
      setStates(s);
      setLoadedCountryId(d.country_id);
      reset({
        name: d.name,
        code: d.code,
        dmName: d.dm_name,
        countryId: d.country_id,
        stateId: d.state_id,
      });
    };
    void load();
  }, [id, isEdit, reset]);

  const onSubmit = async (v) => {
    const p = {
      name: v.name,
      code: v.code,
      dm_name: v.dmName,
      country_id: v.countryId,
      state_id: v.stateId,
    };
    if (isEdit) await districtApi.update(id, p);
    else await districtApi.create(p);
    nav("/master/district");
  };

  return (
    <div className="max-w-xl">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        {isEdit ? "Edit District" : "Add District"}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label>District Name</Label>
          <Input {...register("name")} />
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <select
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            {...register("countryId")}
          >
            <option value={0}>Select country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <select
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            {...register("stateId")}
          >
            <option value={0}>Select state</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>District Code</Label>
          <Input {...register("code")} />
        </div>
        <div className="space-y-2">
          <Label>DM Name</Label>
          <Input {...register("dmName")} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => nav("/master/district")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default DistrictMasterFormPage;
