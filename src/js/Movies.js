import axios from 'axios';
import { elements } from './elements';

//const movieDBAPI = `658089821f5306239c56ca48bb6c29e3`;

export class Movies {
    constructor() {
        this.movies = [];
        this.movieImages = [];
        this.movieVideos = [];
        this.movieDetails = [];
        this.movieCredits = [];
    }

    async getMovies() {
        try {
            const { data : { results : res }} = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=658089821f5306239c56ca48bb6c29e3`);
    
            res.forEach(el => {                
                const title = el.title.replace(/ *\([^)]*\) */g, ' ');
                const year = el.release_date.split('-')[0];
                const genres = el.genre_ids;
                const scores = el.vote_average;

                const movieInformations = {
                    id: el.id,
                    title: title,
                    year: year,
                    genres: genres,
                    score: scores
                };

                this.movies.push(movieInformations);
            });
        } catch(err) {
            alert("Error in getMovies().");
            console.log(err);
        }
    }

    async getImages() {
        for(const movie of this.movies) {
            const image = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=658089821f5306239c56ca48bb6c29e3`);
            const backdrop = `https://image.tmdb.org/t/p/original/${image.data.backdrops[0].file_path}`;
            const posters = `https://image.tmdb.org/t/p/original/${image.data.posters[0].file_path}`;

            const images = {
                backdrop: backdrop,
                poster: posters
            };

            this.movieImages.push(images);
        }
    }

    async getVideos() {
        for(const movie of this.movies) {
            const { data : { results : videos }} = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=658089821f5306239c56ca48bb6c29e3&language=en-US`);
            
            const site = videos[0].site;
            let trailer;
            if(site === "YouTube") {
                trailer = `https://www.youtube.com/embed/${videos[0].key}?autoplay=1&loop=1&playlist=${videos[0].key}`;
            } else if(site === "Vimeo") {
                trailer = `https://player.vimeo.com/video/${videos[0].key}?autoplay=true&loop=true`;
            }

            this.movieVideos.push(trailer);
        }
    }

    async getDetails() {
        for(const movie of this.movies) {
            const { data : res } = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=658089821f5306239c56ca48bb6c29e3&language=en-US`);

            const overview = res.overview;
            const runtime = res.runtime;
            
            const movieDetail = {
                overview : overview,
                runtime : runtime
            }
            this.movieDetails.push(movieDetail);
        }
    }

    async getCredits() {
        for(const movie of this.movies) {
            const { data : res } = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=658089821f5306239c56ca48bb6c29e3&language=en-US`);

            const credit = {
                cast : res.cast.splice(0, 8),
                director : []
            }

            res.crew.forEach(el => {
                if(el.job === "Director") {
                    credit.director.push(el.name);
                }
            });

            credit.cast.forEach(el => {
                el.profile_path = `https://image.tmdb.org/t/p/original/${el.profile_path}`;
            });

            this.movieCredits.push(credit);
            console.log(credit);
        }
    }
}

export const getMovieGenres = (genres, movies, idx) => {
    const genreIds = movies.movies[idx].genres;
    let genresArr = [];

    genreIds.forEach(id => {
        const idx = genres.findIndex(el => el.id === id);
        genresArr.push(genres[idx].name);
    });
    
    return genresArr;
}

export const insertGenres = genres => {
    const markups = genres.map(el => 
        `<li class="movie-genre"><p>${el}</p></li>`
    );
    const markup = markups.join('');

    elements.mainMovieGenres.insertAdjacentHTML('afterbegin', markup);
};

export const clearGenres = () => {
    elements.mainMovieGenres.innerHTML = '';
};