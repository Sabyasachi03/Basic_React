import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { decryptId } from "@/lib/crypto";
import {
  cityApi,
  countryApi,
  districtApi,
  stateApi,
} from "@/services/masterApiService";

const schema = z.object({
  name: z.string().min(2),
  code: z.string().min(1),
  mayorName: z.string().min(2),
  countryId: z.coerce.number().int().positive(),
  stateId: z.coerce.number().int().positive(),
  districtId: z.coerce.number().int().positive(),
});

function CityMasterFormPage() {
  const nav = useNavigate();
  const { encryptedId } = useParams();
  const id = decryptId(encryptedId);
  const isEdit = id > 0;

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [loadedCountryId, setLoadedCountryId] = useState(null);
  const [loadedStateId, setLoadedStateId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      mayorName: "",
      countryId: 0,
      stateId: 0,
      districtId: 0,
    },
  });

  const countryId = watch("countryId");
  const stateId = watch("stateId");

  useEffect(() => {
    void countryApi.list().then(setCountries);
  }, []);

  useEffect(() => {
    const run = async () => {
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
    void run();
  }, [countryId, loadedCountryId, setValue]);

  useEffect(() => {
    const run = async () => {
      if (
        Number(countryId) === loadedCountryId &&
        Number(stateId) === loadedStateId
      )
        return;
      if (!countryId || !stateId || countryId === "0" || stateId === "0") {
        setDistricts([]);
        setValue("districtId", 0);
        setLoadedStateId(null);
        return;
      }
      const d = await districtApi.list({
        country_id: Number(countryId),
        state_id: Number(stateId),
      });
      setDistricts(d);
      setLoadedStateId(Number(stateId));
    };
    void run();
  }, [countryId, stateId, loadedCountryId, loadedStateId, setValue]);

  useEffect(() => {
    const run = async () => {
      if (!isEdit) return;
      const c = await cityApi.getById(id);
      const st = await stateApi.list(c.country_id);
      const di = await districtApi.list({
        country_id: c.country_id,
        state_id: c.state_id,
      });
      setStates(st);
      setDistricts(di);
      setLoadedCountryId(c.country_id);
      setLoadedStateId(c.state_id);
      reset({
        name: c.name,
        code: c.code,
        mayorName: c.mayor_name,
        countryId: c.country_id,
        stateId: c.state_id,
        districtId: c.district_id,
      });
    };
    void run();
  }, [id, isEdit, reset]);

  const onSubmit = async (v) => {
    const p = {
      name: v.name,
      code: v.code,
      mayor_name: v.mayorName,
      country_id: v.countryId,
      state_id: v.stateId,
      district_id: v.districtId,
    };
    if (isEdit) await cityApi.update(id, p);
    else await cityApi.create(p);
    nav("/master/city");
  };

  return (
    <div className="max-w-xl">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        {isEdit ? "Edit City" : "Add City"}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label>City Name</Label>
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
          <Label>District</Label>
          <select
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            {...register("districtId")}
          >
            <option value={0}>Select district</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>City Code</Label>
          <Input {...register("code")} />
        </div>
        <div className="space-y-2">
          <Label>Mayor Name</Label>
          <Input {...register("mayorName")} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => nav("/master/city")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CityMasterFormPage;
