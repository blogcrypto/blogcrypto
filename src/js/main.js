import { Market } from '../components/market/market';
import { Switcher } from '../components/switcher/switcher';
import LazyLoad from 'vanilla-lazyload';

export const lazyLoadInit = () => {
    const lazy = new LazyLoad({
        use_native: true
    });

    document.addEventListener('lazy:update', () => lazy.update());
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-market').forEach((el) => {
        new Market(el);
    });

    document.querySelectorAll('.js-switcher').forEach((el) => {
        new Switcher(el);
    });

    lazyLoadInit();
});


// import cyrillicToTranslit from 'cyrillic-to-translit-js';
// const str = 'Лучшие биржи криптовалют';
// console.log(cyrillicToTranslit().transform(str.toLowerCase(), '-'));
