export const api = {
  getMovies() {
    return fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=a07e22bc18f5cb106bfe4cc1f83ad8ed', {
      headers: {
        'Cache-Control': 'no-cache'
      }
    }).then((response) => response.json())
  }
 }

 export default api;
