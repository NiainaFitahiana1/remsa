import { useEffect, useState } from "react";

import { geoapifyAutocomplete } from "../services/geoapify";

import { GeoapifyFeature } from "@/types";

export default function useGeoapifyAutocomplete(
  query: string
) {
  const [suggestions, setSuggestions] =
    useState<GeoapifyFeature[]>([]);

  const [loading, setLoading] =
    useState<boolean>(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query?.length > 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(debounce);
  }, [query]);

  const fetchSuggestions = async (
    text: string
  ) => {
    try {
      setLoading(true);

      const results =
        await geoapifyAutocomplete(text);

      setSuggestions(results);
    } catch (error) {
      console.error(
        "Erreur Geoapify :",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    suggestions,
    loading,
    setSuggestions,
  };
}