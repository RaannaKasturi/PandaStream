const moviesList = document.getElementById("movies-list");
const player = document.getElementById("moviePlayer");
const status = document.getElementById("status");
const serverOptions = document.getElementById("server-options");

let selectedMovie = null;

// Fetch the TMDB API key from the backend
async function fetchApiKey() {
  const response = await fetch("/getApiKey");
  const data = await response.json();
  return data.apiKey;
}

// Function to search for movies
async function searchMovies() {
  const movieName = document.getElementById("movieName").value.trim();
  if (!movieName) {
    status.textContent = "Please enter a movie name.";
    return;
  }

  status.textContent = "Searching...";
  moviesList.innerHTML = "";
  player.src = ""; // Clear player if it was playing
  serverOptions.style.display = "none"; // Hide server options initially

  try {
    const apiKey = await fetchApiKey();
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        movieName
      )}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      status.textContent = `Found ${data.results.length} movies. Click on a movie to view it.`;
      displayMovies(data.results);
    } else {
      status.textContent = "No results found.";
    }
  } catch (error) {
    status.textContent = "Error fetching movie data.";
    console.error(error);
  }
}

// Function to display the list of movies
function displayMovies(movies) {
  movies.forEach((movie) => {
    const movieItem = document.createElement("div");
    movieItem.classList.add("movie-item");
    movieItem.textContent = `${movie.title} (${
      movie.release_date ? movie.release_date.split("-")[0] : "N/A"
    })`;
    movieItem.onclick = () => playMovie(movie.id);
    moviesList.appendChild(movieItem);
  });
}

// Function to play the movie and show server options
function playMovie(movieId) {
  selectedMovie = movieId; // Store selected movie ID
  const videoUrl = `https://multiembed.mov/?video_id=${movieId}&tmdb=1`;
  player.src = videoUrl;
  status.textContent = `Streaming movie with ID: ${movieId}`;
  moviesList.innerHTML = ""; // Clear the list after selecting
  serverOptions.style.display = "block"; // Show server options below the player
}

// Function to play the movie from the selected server
function playFromServer(server) {
  let videoUrl;
  switch (server) {
    case "server1":
      videoUrl = `https://vidsrc.xyz/embed/movie/tt${selectedMovie}`;
      break;
    case "server2":
      videoUrl = `https://multiembed.mov/?video_id=${selectedMovie}&tmdb=1`;
      break;
    case "server3":
      videoUrl = `https://moviesapi.club/movie/${selectedMovie}`;
      break;
    default:
      status.textContent = "Invalid server selection.";
      return;
  }

  player.src = videoUrl;
  status.textContent = `Streaming movie from ${server}.`;
}
