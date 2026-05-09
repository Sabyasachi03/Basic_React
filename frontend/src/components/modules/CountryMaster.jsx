import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CountryMaster({
  countries,
  selectedCountryId,
  onSelectCountry,
  onAddCountry,
  onEditCountry,
  onDeleteCountry,
}) {
  const [name, setName] = useState("");
  const [editingCountryId, setEditingCountryId] = useState(null);

  const editingCountry = useMemo(
    () => countries.find((country) => country.id === editingCountryId),
    [countries, editingCountryId]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    if (editingCountryId) {
      onEditCountry(editingCountryId, name.trim());
      setEditingCountryId(null);
    } else {
      onAddCountry(name.trim());
    }

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
          placeholder="Add or edit country"
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" className="flex-1">
            <Plus className="h-4 w-4" /> {editingCountry ? "Update" : "Add"}
          </Button>
          {editingCountry && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setEditingCountryId(null);
                setName("");
              }}
            >
              Cancel
            </Button>
          )}
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
                  onClick={() => {
                    setEditingCountryId(country.id);
                    setName(country.name);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
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