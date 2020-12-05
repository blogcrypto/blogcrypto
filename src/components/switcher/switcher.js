export class Switcher {
    /**
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.el = el;
        this.el.Switcher = this;
        this.root = this.el;
        this.userLang = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;

        this.init();
        this.setListeners();
    }

    init() {
        /**
         * Set switcher value from html lang
         */
        this.el.value = document.documentElement.lang || 'en';

        if (!localStorage.getItem('locale')) {
            const getLocale = this.userLang.toLowerCase().substring(0, 2);

            if (document.location.pathname === '/' && getLocale !== 'en') {
                this.setLocale(getLocale);
            } else {
                localStorage.setItem('locale', this.el.value);
            }
        } else {
            if (document.location.pathname === '/') {
                this.setLocale(localStorage.getItem('locale'))
            } else {
                localStorage.setItem('locale', this.el.value);
            }
        }
    }

    setListeners() {
        if (this.root) {
            this.root.addEventListener('change', e => this.setLocale(e.target.value));
        }
    }

    setLocale(locale) {
        if (locale !== 'en') {
            document.location.href = document.location.origin + '/' + locale + '/index';
        } else {
            document.location.href = document.location.origin + '/index';
        }

        localStorage.setItem('locale', locale);
    }
}
