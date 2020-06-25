import axios from 'axios';
import { Movies, getMovieGenres, insertGenres, clearGenres } from './Movies';
import { elements, selectors } from './elements';
import { Carousel, insertCarousel } from './Carousel';

const state = {};
let trailer_on = false;
let details_on = false;
let mainIdx;

const mainController = async () => {
    state.movies = new Movies();
    try {
        if(state.movies) {
            renderLoader();

            await state.movies.getMovies();
            await state.movies.getImages();
            await state.movies.getVideos();
            await state.movies.getDetails();
            await state.movies.getCredits();
            await getGenres();       

            elements.blackout.classList.add('out');
            
            clearLoader();
            
            /* ------------------ Carousel ------------------ */
            const carouselMovies = state.movies.movies;
            const carouselImages = state.movies.movieImages; 
    
            for(const movie of carouselMovies) {
                const idx = carouselMovies.findIndex(el => el.id === movie.id);
                insertCarousel(movie.id, carouselImages[idx].poster);
            }
    
            const carouselItems = document.querySelectorAll(selectors.carouselItems);
            const carouselControllers = [elements.carouselLeftBtn, elements.carouselRightBtn];
    
            const carousel = new Carousel(carouselItems, carouselControllers);
    
            if(carousel) {
                carousel.useControls();
                carousel.initialState();
                getInformations();
            }
            /* ---------------------------------------------- */
            /* ------------------ Buttons ------------------- */
            carouselControllers.forEach(controller => {
                controller.addEventListener('click', () => {
                    getInformations();
                });
            });
            
            /* ---------------------------------------------- */

            elements.blackout.parentElement.removeChild(elements.blackout);
        }
    } catch(err) {
        alert("Error occurred in Controller!");
        console.log(err);
    }
};

window.addEventListener('load', mainController);

const getInformations = () => {
    const center = document.querySelector('.poster-li-3');   
    const id = center.dataset.id;
    const idx = state.movies.movies.findIndex(el => el.id == id);
    mainIdx = idx;
                
    const mainImage = state.movies.movieImages[idx].backdrop;
    const mainTitle = state.movies.movies[idx].title;
    const mainYear = state.movies.movies[idx].year;
    const mainGenre = getMovieGenres(state.genres, state.movies, idx);

    state.movies.trailer = state.movies.movieVideos[idx];

    /* ------------------- Changing Animation -------------------- */
    elements.mainMovie.classList.remove('in');
    elements.mainMovie.classList.toggle('out');

    elements.backgroundImage.classList.remove('in');
    elements.backgroundImage.classList.toggle('out');
    /* ----------------------------------------------------------- */
    /* ------------------- Change Informations ------------------- */
    window.setTimeout(() => {
        clearGenres();
        renderScores(idx);
        elements.backgroundImage.src = `${mainImage}`;
        elements.mainMovieTitle.innerHTML = `${mainTitle}`;
        elements.mainMovieYear.innerHTML = `${mainYear}`;        
        insertGenres(mainGenre);
    }, 800);
    /* ----------------------------------------------------------- */
    /* ------------------- Changing Animation -------------------- */
    window.setTimeout(() => {
        elements.mainMovie.classList.toggle('out');
        elements.backgroundImage.classList.toggle('out');
    }, 1000);
    /* ----------------------------------------------------------- */
};

const getGenres = async () => {
    const { data : { genres : res }} = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=658089821f5306239c56ca48bb6c29e3&language=en-US`);

    state.genres = res;
};

const renderScores = idx => {
    const mainMovieScore = state.movies.movies[idx].score;

    if(mainMovieScore >= 8.7) {
        elements.firstStar.src = "./img/star.svg";
        elements.secondStar.src = "./img/star.svg";
        elements.thirdStar.src = "./img/star.svg";
        elements.fourthStar.src = "./img/star.svg";
        elements.fifthStar.src = "./img/star.svg";
    } else if(mainMovieScore >= 7.5) {
        elements.firstStar.src = "./img/star.svg";
        elements.secondStar.src = "./img/star.svg";
        elements.thirdStar.src = "./img/star.svg";
        elements.fourthStar.src = "./img/star.svg";
        elements.fifthStar.src = "./img/star-outline.svg";
    } else if(mainMovieScore >= 5.8) {
        elements.firstStar.src = "./img/star.svg";
        elements.secondStar.src = "./img/star.svg";
        elements.thirdStar.src = "./img/star.svg";
        elements.fourthStar.src = "./img/star-outline.svg";
        elements.fifthStar.src = "./img/star-outline.svg";
    } else if(mainMovieScore >= 3) {
        elements.firstStar.src = "./img/star.svg";
        elements.secondStar.src = "./img/star.svg";
        elements.thirdStar.src = "./img/star-outline.svg";
        elements.fourthStar.src = "./img/star-outline.svg";
        elements.fifthStar.src = "./img/star-outline.svg";
    } else if(mainMovieScore >= 0.1) {
        elements.firstStar.src = "./img/star.svg";
        elements.secondStar.src = "./img/star-outline.svg";
        elements.thirdStar.src = "./img/star-outline.svg";
        elements.fourthStar.src = "./img/star-outline.svg";
        elements.fifthStar.src = "./img/star-outline.svg";
    } else {
        elements.firstStar.src = "./img/star-outline.svg";
        elements.secondStar.src = "./img/star-outline.svg";
        elements.thirdStar.src = "./img/star-outline.svg";
        elements.fourthStar.src = "./img/star-outline.svg";
        elements.fifthStar.src = "./img/star-outline.svg";
    }
        
};

const renderTrailer = () => {
    const markup = `
        <iframe width="100%" height="100%" class="trailer" src=${state.movies.trailer} allow="autoplay; fullscreen" frameborder="0" allowfullscreen>
        </iframe>
    `;

    elements.trailerPage.insertAdjacentHTML('afterbegin', markup);
};

const clearTrailer = () => {
    const trailer = document.querySelector('.trailer');
    window.setTimeout(() => {
        trailer.parentNode.removeChild(trailer);
    }, 1000);
    
};

const renderDetails = () => {
    const markup = `
        <div class="details-wrapper">
            <div class="details-gradient"></div>
            <div class="details-overview">
                <p class="details-overview-p">${state.movies.movieDetails[mainIdx].overview}</p>
                <p class="details-runtime">${processRuntime(state.movies.movieDetails[mainIdx].runtime)}</p>
                <p class="details-director">${processDirector(state.movies.movieCredits[mainIdx].director)}</p>
            </div>
            <div class="details-cast">
                <p>Casts</p>
                <ul class="details-casts">
                </ul>
            </div>
        </div>
    `;

    elements.detailsPage.insertAdjacentHTML('afterbegin', markup);

    const credits = state.movies.movieCredits[mainIdx].cast.map(el => 
        `<li class="detail-casts-li"><img src="${el.profile_path === "https://image.tmdb.org/t/p/original/null" ? "http://placehold.it/85x120/" : el.profile_path}"><p>${el.name}</p></li>`
    );

    const result = credits.join('');

    document.querySelector('.details-casts').insertAdjacentHTML('afterbegin', result);
};

const processRuntime = time => {
    const hours = parseInt(time / 60, 10);
    const minute = time - 60*hours;
    
    return `${hours}:${minute < 10 ? `0${minute}` : minute}h`;
}

const processDirector = directors => {
    return directors.join(', ');
}

const clearDetails = () => {
    const wrapper = document.querySelector('.details-wrapper');
    wrapper.parentElement.removeChild(wrapper);
}

elements.menu.addEventListener('click', e => {
    if(e.target.matches('.upper-menu-overview')) {
        elements.overviewMenu.classList.add('focused');
        elements.trailerMenu.classList.remove('focused');
        elements.trailerMenu.classList.add('unfocused');
        elements.detailsMenu.classList.remove('focused');
        elements.detailsMenu.classList.add('unfocused');

        elements.trailerPage.classList.remove('slide-in');
        elements.carouselContainer.classList.remove('fade-out');
        elements.mainPageLower.classList.remove('fade-out');
        elements.lowerButtons.classList.remove('fade-out');
        elements.backgroundImage.classList.remove('fade-out');
        elements.mainMovie.classList.remove('up');
        elements.detailsPage.classList.add('out');

        if(trailer_on) {
            trailer_on = false;
            clearTrailer();
        }

        if(details_on) {
            details_on = false;
            elements.mainMovie.classList.add('down');
            window.setTimeout(() => {
                clearDetails();
                elements.mainMovie.classList.remove('down');
            }, 500);
        }

    } else if(e.target.matches('.upper-menu-trailer')) {
        elements.trailerMenu.classList.add('focused');
        elements.overviewMenu.classList.remove('focused');
        elements.overviewMenu.classList.add('unfocused');
        elements.detailsMenu.classList.remove('focused');
        elements.detailsMenu.classList.add('unfocused');

        elements.trailerPage.classList.add('slide-in');
        elements.carouselContainer.classList.add('fade-out');
        elements.mainPageLower.classList.add('fade-out');
        elements.backgroundImage.classList.add('fade-out');
        elements.mainMovie.classList.remove('up');
        elements.detailsPage.classList.add('out');

        if(!trailer_on) {
            renderTrailer();
            trailer_on = true;
        }

        if(details_on) {
            details_on = false;
            elements.mainMovie.classList.add('down');
            window.setTimeout(() => {
                clearDetails();
                elements.mainMovie.classList.remove('down');
            }, 500);
        }

    } else if(e.target.matches('.upper-menu-details')) {
        elements.detailsMenu.classList.add('focused');
        elements.trailerMenu.classList.remove('focused');
        elements.trailerMenu.classList.add('unfocused');
        elements.overviewMenu.classList.remove('focused');
        elements.overviewMenu.classList.add('unfocused');

        elements.trailerPage.classList.remove('slide-in');
        elements.carouselContainer.classList.add('fade-out');
        elements.mainPageLower.classList.remove('fade-out');
        elements.lowerButtons.classList.add('fade-out');
        elements.mainMovie.classList.add('up');
        elements.detailsPage.classList.remove('out');

        if(trailer_on) {
            trailer_on = false;
            elements.backgroundImage.classList.remove('fade-out');
            clearTrailer();
        }

        if(!details_on) {
            details_on = true;
            renderDetails();        
        }
    }
});

elements.movieBtns.addEventListener('click', e => {
    if(e.target.matches('.movie-buttons-info')) {
        elements.detailsMenu.classList.add('focused');
        elements.trailerMenu.classList.remove('focused');
        elements.trailerMenu.classList.add('unfocused');
        elements.overviewMenu.classList.remove('focused');
        elements.overviewMenu.classList.add('unfocused');

        elements.trailerPage.classList.remove('slide-in');
        elements.carouselContainer.classList.add('fade-out');
        elements.mainPageLower.classList.remove('fade-out');
        elements.lowerButtons.classList.add('fade-out');
        elements.mainMovie.classList.add('up');
        elements.detailsPage.classList.remove('out');

        if(trailer_on) {
            trailer_on = false;
            elements.backgroundImage.classList.remove('fade-out');
            clearTrailer();
        }

        if(!details_on) {
            details_on = true;
            renderDetails();        
        }
    }
});

const renderLoader = () => {
    const markup = `
        <div class="loader-wrapper">
            <svg version="1.1" 
                class="svg-loader" 
                xmlns="http://www.w3.org/2000/svg" 
                xmlns:xlink="http://www.w3.org/1999/xlink" 
                x="0px" 
                y="0px"
                viewBox="0 0 80 80" 
                xml:space="preserve">

                <path
                    id="spinner" 
                    fill="#E50914" 
                    d="M40,72C22.4,72,8,57.6,8,40C8,22.4,
                    22.4,8,40,8c17.6,0,32,14.4,32,32c0,1.1-0.9,2-2,2
                    s-2-0.9-2-2c0-15.4-12.6-28-28-28S12,24.6,12,40s12.6,
                    28,28,28c1.1,0,2,0.9,2,2S41.1,72,40,72z"
                >

                    <animateTransform
                        attributeType="xml"
                        attributeName="transform"
                        type="rotate"
                        from="0 40 40"
                        to="360 40 40"
                        dur="0.6s"
                        repeatCount="indefinite"
                    />
                </path>
            </svg>
        </div>
    `;

    elements.mainPage.insertAdjacentHTML('afterbegin', markup);
};

const clearLoader = () => {
    const loader = document.querySelector('.loader-wrapper');

    loader.parentNode.removeChild(loader);
}