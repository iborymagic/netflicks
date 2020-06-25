import { elements } from "./elements";

export class Carousel {
    constructor(items, controls) {
        this.items = items;
        this.controls = controls;
    }

    initialState() {
        /*
        this.items[0].classList.add('poster-li-0');
        this.items[1].classList.add('poster-li-1');
        this.items[2].classList.add('poster-li-2');
        this.items[3].classList.add('poster-li-3');
        this.items[4].classList.add('poster-li-4');
        this.items[5].classList.add('poster-li-5');
        this.items[6].classList.add('poster-li-6');
        */
        this.items.forEach((el, idx) => {
            el.classList.add(`poster-li-${idx}`);
        });
    }
    setState(dir, arr) {
        arr.forEach((el, idx) => {
            const next = idx + 1 > this.items.length - 1 ? 0 : idx + 1;
            const pre =  idx - 1 < 0 ? this.items.length - 1 : idx - 1;

            el.classList.remove(`poster-li-${idx}`);
            if(dir === 'lower-buttons-left') {
                el.classList.add(`poster-li-${pre}`);
            } else {
                el.classList.add(`poster-li-${next}`);
            }
        });
    }
/*
    setState(dir, first, second, third, middle, fifth, sixth, seventh) {        
        middle.classList.remove('poster-li-3');
        if(dir === 'lower-buttons-left') {
            middle.classList.add('poster-li-2');
        } else {
            middle.classList.add('poster-li-4');
        }

        first.classList.remove('poster-li-0');
        if(dir === 'lower-buttons-left') {
            first.classList.add('poster-li-6');
        } else {
            first.classList.add('poster-li-1');
        }

        second.classList.remove('poster-li-1');
        if(dir === 'lower-buttons-left') {
            second.classList.add('poster-li-0');
        } else {
            second.classList.add('poster-li-2');
        }

        third.classList.remove('poster-li-2');
        if(dir === 'lower-buttons-left') {
            third.classList.add('poster-li-1');
        } else {
            third.classList.add('poster-li-3');
        }

        fifth.classList.remove('poster-li-4');
        if(dir === 'lower-buttons-left') {
            fifth.classList.add('poster-li-3');
        } else {
            fifth.classList.add('poster-li-5');
        }

        sixth.classList.remove('poster-li-5');
        if(dir === 'lower-buttons-left') {
            sixth.classList.add('poster-li-4');
        } else {
            sixth.classList.add('poster-li-6');
        }

        seventh.classList.remove('poster-li-6');
        if(dir === 'lower-buttons-left') {
            seventh.classList.add('poster-li-5');
        } else {
            seventh.classList.add('poster-li-0');
        }

    }
*/
    useControls() {
        this.controls.forEach(el => {
            el.addEventListener('click', e => {
                const btnSpan = e.target.closest('.lower-buttons');
                /*
                const first = document.querySelector('.poster-li-0');
                const second = document.querySelector('.poster-li-1');
                const third = document.querySelector('.poster-li-2');
                const middle = document.querySelector('.poster-li-3');
                const fifth = document.querySelector('.poster-li-4');
                const sixth = document.querySelector('.poster-li-5');
                const seventh = document.querySelector('.poster-li-6');
                */
                const posters = [];
                for(let i = 0; i < this.items.length; i++) {
                    posters[i] = document.querySelector(`.poster-li-${i}`);
                }

                // this.setState(btnSpan.id, first, second, third, middle, fifth, sixth, seventh);
                this.setState(btnSpan.id, posters);
            });
        });
    }
}

export const insertCarousel = (id, img) => {
    const markup = `
        <li class="middle-lower-posters-li" data-id="${id}" style="background-image: url('${img}')"></li>
    `;

    elements.carouselList.insertAdjacentHTML('beforeend', markup);
}

