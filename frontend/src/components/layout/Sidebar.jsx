import CountryMaster from "@/components/modules/CountryMaster";

function Sidebar({
  countries,
  selectedCountryId,
  onSelectCountry,
  onAddCountry,
  onEditCountry,
  onDeleteCountry,
}) {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <CountryMaster
        countries={countries}
        selectedCountryId={selectedCountryId}
        onSelectCountry={onSelectCountry}
        onAddCountry={onAddCountry}
        onEditCountry={onEditCountry}
        onDeleteCountry={onDeleteCountry}
      />
    </aside>
  );
}

export default Sidebar;