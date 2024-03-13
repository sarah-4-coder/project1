import { useEffect, useState, useRef } from "react";
import StarRating from "./Starrating";
import { useMovies } from "./useMovies";
import { useLocalStoragestate } from "./useLocalStorageState";
import { useKey } from "./useKey";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = "2ee5f3f5";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedid, setSelectedid] = useState(null);

  const { movies, isloading, error } = useMovies(query);

  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(function () {
  //   return JSON.parse(localStorage.getItem("watched")) || [];
  // });

  // using uselocalstoragestate custom hook
  const [watched, setWatched] = useLocalStoragestate([], "watched");

  function handleSelectMovie(id) {
    setSelectedid((selectedid) => (id === selectedid ? null : id));
  }

  function handleClose() {
    setSelectedid(null);
  }

  function handleaddwatchedmovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handledeletewatchedmovie(id) {
    setWatched(watched.filter((item) => item.imdbID !== id));
  }

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {/* {isloading ? <Loader /> : <Movielist movies={movies} />} */}
          {isloading && <Loader />}
          {!isloading && !error && (
            <Movielist movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
          {error && <Error message={error} />}
        </Box>
        <Box>
          {selectedid ? (
            <MovieDetail
              selectedid={selectedid}
              onclose={handleClose}
              onAddMovie={handleaddwatchedmovie}
              watched={watched}
            />
          ) : (
            <>
              <Watchedsummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                ondeletewatched={handledeletewatchedmovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function Error({ message }) {
  return (
    <p className="error">
      <span>🚨</span>
      {message}
    </p>
  );
}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (document.activeElement === inputEl.current) return;
  //       if (e.key === "Enter") {
  //         inputEl.current.focus();
  //         setQuery("");
  //       }
  //     }

  //     document.addEventListener("keydown", callback);
  //     return () => {
  //       document.addEventListener("keydown", callback);
  //     };
  //   },
  //   [setQuery]
  // );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieDetail({ selectedid, onclose, onAddMovie, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setisloading] = useState(false);
  const [userRating, setuserrating] = useState("");

  const iswatched = watched.map((movie) => movie.imdbID).includes(selectedid);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedid
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function addwatchedmovie() {
    const newwatchedmovie = {
      imdbID: selectedid,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddMovie(newwatchedmovie);
    onclose();
  }

  useKey("Escape", onclose);

  useEffect(
    function () {
      async function getMoviesdetail() {
        setisloading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedid}`
        );
        const data = await res.json();
        setMovie(data);
        setisloading(false);
      }
      getMoviesdetail();
    },
    [selectedid]
  );

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onclose}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>IMDB Rating: {imdbRating}</p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!iswatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={25}
                    onSetRating={setuserrating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={addwatchedmovie}>
                      +Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>Movie is already rated with {watchedUserRating}🌟</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Watchedsummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, ondeletewatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Watchedmovie
          key={movie.imdbID}
          movie={movie}
          ondeletewatched={ondeletewatched}
        />
      ))}
    </ul>
  );
}

function Watchedmovie({ movie, ondeletewatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => ondeletewatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

function Movielist({ movies, handleSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li onClick={() => handleSelectMovie(movie.imdbID)} key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
