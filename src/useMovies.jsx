import { useState, useEffect } from "react";

const key = "73615c4f";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // callback?.();

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoaded(true);
        setError("");

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();

        if (data.Response === "False") throw new Error("movie not found");

        setMovies(data.Search);
        setError("");

        return () => controller.abort();
      } catch (err) {
        if (err.message !== "AbortError") setError(err.message);
      } finally {
        setIsLoaded(false);
      }
    }
    if (!query.length) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();
  }, [query]);

  return { movies, isLoaded, error };
}
