import LazyLoad from 'vanilla-lazyload';
// import { Market } from '../components/market/market';
import { Switcher } from '../components/switcher/switcher';
import { Form } from '../components/form/form';

export const lazyLoadInit = () => {
    const lazy = new LazyLoad({
        use_native: true
    });

    document.addEventListener('lazy:update', () => lazy.update());
};

document.addEventListener('DOMContentLoaded', () => {
    lazyLoadInit();

    // document.querySelectorAll('.js-market').forEach((el) => {
    //     new Market(el);
    // });

    document.querySelectorAll('.js-switcher').forEach((el) => {
        new Switcher(el);
    });

    document.querySelectorAll('.js-form').forEach((el) => {
        new Form(el);
    });
});


// import cyrillicToTranslit from 'cyrillic-to-translit-js';
// const str = 'Руководство пользователя приложения BlogCrypto Portfolio';
// const str = 'BlogCrypto\'s Portfolio App User Guide';
// console.log(cyrillicToTranslit().transform(str.toLowerCase(), '-'));
