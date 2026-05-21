import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CountryMaster({
  countries,
  selectedCountryId,
  onSelectCountry,
  onAddCountry,
  onDeleteCountry,
}) {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    onAddCountry(name.trim());
    setName("");
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Country Master</h2>
        <p className="text-sm text-slate-600">Manage countries and select one to load cart data.</p>
      </div>

      <form className="space-y-2" onSubmit={handleSubmit}>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Add country"
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" className="flex-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </form>

      <div className="space-y-2">
        {countries.map((country) => {
          const active = selectedCountryId === country.id;
          return (
            <div
              key={country.id}
              className={`group flex items-center justify-between rounded-lg border px-3 py-2 transition ${
                active
                  ? "border-cyan-300 bg-cyan-50 text-cyan-900"
                  : "border-slate-200 bg-white text-slate-800 hover:border-cyan-200 hover:bg-cyan-50/50"
              }`}
            >
              <button
                type="button"
                className="flex-1 text-left text-sm font-medium"
                onClick={() => onSelectCountry(country.id)}
              >
                {country.name}
              </button>

              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteCountry(country.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CountryMaster;
