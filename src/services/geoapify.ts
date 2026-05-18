
import { GeoapifyFeature, GeoapifyResponse } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

if (!API_KEY) {
  throw new Error(
    "❌ NEXT_PUBLIC_GEOAPIFY_API_KEY est manquant dans le fichier .env.local"
  );
}

const API_KEY_VALID: string = API_KEY;

const BASE_URL = "https://api.geoapify.com/v1/geocode";

interface AutocompleteOptions {
  countrycode?: string;
  limit?: number;
}

export async function geoapifyAutocomplete(
  text: string,
  options: AutocompleteOptions = {}
): Promise<GeoapifyFeature[]> {
  const { countrycode = "mg", limit = 5 } = options;

  const params = new URLSearchParams({
    text,
    countrycode,
    limit: String(limit),
    apiKey: API_KEY_VALID,        // ← Type string garanti
  });

  const response = await fetch(
    `${BASE_URL}/autocomplete?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Geoapify API error: ${response.status} ${response.statusText}`);
  }

  const data: GeoapifyResponse = await response.json();

  return data.features || [];
}