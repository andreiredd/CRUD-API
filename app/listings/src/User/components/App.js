import React, { useReducer, useEffect } from "react";
import "../App.css";
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";

const MOVIE_API_URL = "https://www.omdbapi.com/?s=";
const INITIAL_SEARCH = "man";
const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

const initialState = {
  loading: false,
  movies: [],
  errorMessage: null
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    fetch(`${MOVIE_API_URL}${INITIAL_SEARCH}${API_KEY}`)
      .then(res => res.json())
      .then(jsonRes => {
        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: jsonRes.Search
        });
      });
  }, []);

  const search = searchValue => {
    dispatch({
      type: "SEARCH_MOVIES_REQUEST"
    });

    fetch(`${MOVIE_API_URL}${searchValue}${API_KEY}`)
      .then(res => res.json())
      .then(jsonRes => {
        if (jsonRes.Response === "True") {
          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonRes.Search
          });
        } else {
          dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            error: jsonRes.Error
          });
        }
      });
  };
  const { movies, errorMessage, loading } = state;
  return (
    <div className="App">
      {console.log(state)}
      <Header text="React Movie Search" />
      <Search search={search} />
      <p className="App-intro">Sharing a few of our favorite movies</p>
      <div className="movies">
        {loading && !errorMessage ? (
          <span>loading...</span>
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}=${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
