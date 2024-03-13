import { useState, useEffect } from "react";

const key = "2ee5f3f5";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [error, seterror] = useState("");

  useEffect(() => {

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setisloading(true);
        seterror("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Something went Wrong");
        }

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movies not found");

        setMovies(data.Search);
        seterror("");
      } catch (err) {
        console.error(err.message);
        if (err.name !== "AbortError") {
          seterror(err.message);
        }
      } finally {
        setisloading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      seterror("");
      return;
    }

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  return { movies, isloading, error };
}
