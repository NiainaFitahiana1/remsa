import { Dispatch, SetStateAction } from "react";
import useGeoapifyAutocomplete from "../hooks/useGeoapifyAutocomplete";

interface ZoneFields {
  zone?: string;        // ← Optionnel pour correspondre à RegisterFormData
  latitude?: number;
  longitude?: number;
}

interface ZoneAutocompleteProps<T extends ZoneFields> {
  formData: T;
  setFormData: Dispatch<SetStateAction<T>>;
  isLoading: boolean;
}

export default function ZoneAutocomplete<T extends ZoneFields>({
  formData,
  setFormData,
  isLoading,
}: ZoneAutocompleteProps<T>) {
  const { suggestions, loading, setSuggestions } = useGeoapifyAutocomplete(
    formData.zone ?? ""
  );

  const handleSelect = (place: (typeof suggestions)[number]) => {
    setFormData((prev) => ({
      ...prev,
      zone: place.properties.formatted,     // zone devient string
      latitude: place.properties.lat,
      longitude: place.properties.lon,
    }));

    setSuggestions([]);
  };

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 ml-1">
        Zone d'opération
      </label>

      <input
        value={formData.zone ?? ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            zone: e.target.value,
          }))
        }
        placeholder="ex: Ambatoroka..."
        autoComplete="off"
        disabled={isLoading}
        className="appearance-none rounded-xl block w-full px-4 py-3.5 border border-gray-200 focus:outline-none focus:border-gray-400"
      />

      {loading && (
        <div className="absolute right-4 top-[52px] text-xs text-gray-400 pointer-events-none">
          Chargement...
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((place, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(place)}
              className="w-full text-left px-4 py-3 hover:bg-red-50 border-b border-gray-100 last:border-b-0"
            >
              <p className="text-sm font-medium text-gray-800">
                {place.properties.formatted}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {place.properties.city ||
                  place.properties.county ||
                  "Madagascar"}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}