import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { decryptId } from "@/lib/crypto";
import { countryApi, stateApi } from "@/services/masterApiService";

const schema = z.object({
  name: z.string().min(2),
  code: z.string().min(1),
  cmName: z.string().min(2),
  countryId: z.coerce.number().int().positive(),
});

function StateMasterFormPage() {
  const nav = useNavigate();
  const { encryptedId } = useParams();
  const id = decryptId(encryptedId);
  const isEdit = id > 0;
  const [countries, setCountries] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", code: "", cmName: "", countryId: 0 },
  });
  useEffect(() => {
    const load = async () => {
      setCountries(await countryApi.list());
      if (isEdit) {
        const s = await stateApi.getById(id);
        reset({
          name: s.name,
          code: s.code,
          cmName: s.cm_name,
          countryId: s.country_id,
        });
      }
    };
    void load();
  }, [id, isEdit, reset]);
  const onSubmit = async (v) => {
    const p = {
      name: v.name,
      code: v.code,
      cm_name: v.cmName,
      country_id: v.countryId,
    };
    if (isEdit) await stateApi.update(id, p);
    else await stateApi.create(p);
    nav("/master/state");
  };
  return (
    <div className="max-w-xl">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        {isEdit ? "Edit State" : "Add State"}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label>State Name</Label>
          <Input {...register("name")} />
          {errors.name && <p className="text-xs text-red-600">Required</p>}
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
          {errors.countryId && <p className="text-xs text-red-600">Required</p>}
        </div>
        <div className="space-y-2">
          <Label>State Code</Label>
          <Input {...register("code")} />
        </div>
        <div className="space-y-2">
          <Label>CM Name</Label>
          <Input {...register("cmName")} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => nav("/master/state")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StateMasterFormPage;
