import { Chart } from '../chart/chart';
import { decimalFormat } from '../../js/utils';
import template from 'lodash/template';

const e = React.createElement;
const MARKET_API = 'https://api.coingecko.com/api/v3';

export class Coin {
    /**
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.el = el;
        this.el.Coin = this;

        this.nodes = {
            name: document.querySelectorAll('.js-coin-name'),
            symbol: document.querySelectorAll('.js-coin-symbol'),
            breadcrumbs: document.querySelector('.breadcrumb-item.active'),
            chartTitle: document.querySelector('.js-coin-chart-title'),
            chart: document.querySelector('#chart-root'),
            template: document.querySelector('#coin-template')
        };

        this.locale = document.documentElement.lang || 'en';

        this.init();
    }

    init() {
        this.getUrl();

        // this.setListeners();
    }

    setListeners() {
    }

    getUrl() {
        const url = document.location.href.split('/coin?');

        if (url.length > 1) {
            this.getCoinData(url[1]);
            this.getCoinChartData(url[1]);
        } else {
            this.renderNotFound();
        }
    }

    changeMeta(coinId, coinName, coinAbbr) {
        const title = document.querySelector('title');
        const description = document.querySelector('meta[name="description"]');
        const canonical = document.querySelector('link[rel="canonical"]');
        const keywords = document.querySelector('meta[name="keywords"]');
        const facebookTitle = document.querySelector('meta[property="og:title"]');
        const facebookDescription = document.querySelector('meta[property="og:description"]');
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');

        const changeKeyWord = (str, target, change) => {
            const re = new RegExp(target, 'g');

            return str.replace(re, change);
        };

        canonical.setAttribute('href', `${ canonical.getAttribute('href') }?${ coinId }`);

        title.textContent = changeKeyWord(title.textContent, 'Coin|Монеты', coinAbbr);
        description.setAttribute('content', changeKeyWord(description.getAttribute('content'), 'Coin|Монеты', coinAbbr));
        keywords.setAttribute('content', changeKeyWord(keywords.getAttribute('content'), 'Coin|Монеты', coinAbbr));
        facebookTitle.setAttribute('content', changeKeyWord(facebookTitle.getAttribute('content'), 'Coin|Монеты', coinAbbr));
        facebookDescription.setAttribute('content', changeKeyWord(facebookDescription.getAttribute('content'), 'Coin|Монеты', coinAbbr));
        twitterTitle.setAttribute('content', changeKeyWord(twitterTitle.getAttribute('content'), 'Coin|Монеты', coinAbbr));
        twitterDescription.setAttribute('content', changeKeyWord(twitterDescription.getAttribute('content'), 'Coin|Монеты', coinAbbr));

        title.textContent = changeKeyWord(title.textContent, 'Cryptocurrency|Криптовалюта', coinName);
        description.setAttribute('content', changeKeyWord(description.getAttribute('content'), 'Cryptocurrency|Криптовалюта', coinName));
        keywords.setAttribute('content', changeKeyWord(keywords.getAttribute('content'), 'Cryptocurrency|Криптовалюта', coinName));
        facebookTitle.setAttribute('content', changeKeyWord(facebookTitle.getAttribute('content'), 'Cryptocurrency|Криптовалюта', coinName));
        facebookDescription.setAttribute('content', changeKeyWord(facebookDescription.getAttribute('content'), 'Cryptocurrency|Криптовалюта', coinName));
        twitterTitle.setAttribute('content', changeKeyWord(twitterTitle.getAttribute('content'), 'Cryptocurrency|Криптовалюта', coinName));
        twitterDescription.setAttribute('content', changeKeyWord(twitterDescription.getAttribute('content'), 'Cryptocurrency|Криптовалюта', coinName));
    }

    renderNotFound() {
        this.el.innerHTML = this.locale === 'ru'
                            ? `<div>
                                  <div class="h2 display-6">Монета не найдена!</div>
                                  <a class="btn btn-primary mt-3" href="/ru/market" role="button">Назад к списку монет</a>
                              </div>`
                            : `<div>
                                  <div class="h2 display-6">Coin not found!</div>
                                  <a class="btn btn-primary mt-3" href="/market" role="button">Back to coin list</a>
                              </div>`;
        this.nodes.chart.innerHTML = '';
        this.nodes.chartTitle.innerHTML = '';
    }

    renderCoinContent(data) {
        this.nodes.breadcrumbs.innerHTML = data.name;
        this.nodes.name.forEach(item => item.innerHTML = data.name);
        this.nodes.symbol.forEach(item => item.innerHTML = data.name.toUpperCase());
        this.el.innerHTML = template(this.nodes.template.innerHTML)({d: data, df: decimalFormat});
    }

    showPreloader(bool) {
        bool
        ? this.el.parentNode.classList.add('loading')
        : this.el.parentNode.classList.remove('loading');
    }

    async getCoinData(coin) {
        const API = `${ MARKET_API }/coins/${ coin }`;
        const PARAMS = `?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`;
        const data = await this.fetchData(API + PARAMS);

        if (data) {
            this.nodes.chartTitle.innerHTML = this.locale === 'ru'
                                              ? `График ${ data.symbol.toUpperCase() } / USD`
                                              : `Chart ${ data.symbol.toUpperCase() } / USD`;
            this.renderCoinContent(data);
            this.changeMeta(data.id, data.name, data.symbol.toUpperCase());
        } else {
            this.renderNotFound();
        }
    }

    async getCoinChartData(coin, currency = 'usd', dateStart = 1356998400, dateEnd) {
        const API = `${ MARKET_API }/coins/${ coin }/market_chart/range`;
        const PARAMS = `?vs_currency=${ currency }&from=${ dateStart }&to=${ dateEnd || Date.now() }`;
        const data = await this.fetchData(API + PARAMS);

        if (data) {
            this.renderCoinChart(data.prices);
        } else {
            this.nodes.chart.innerHTML = '';
            this.nodes.chartTitle.innerHTML = '';
        }
    }

    renderCoinChart(data) {
        const getDate = time => {
            const months_arr = this.locale === 'ru'
                               ? ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
                               : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const date = new Date(time);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();

            return `${ months_arr[month] } ${ day }, ${ year }`;
        };

        if (data.length) {
            ReactDOM.render(e(Chart, {
                data: data.map(item => ({name: getDate(item[0]), price: +item[1].toFixed(2)})),
                isFiat: true,
                currency: 'USD',
                brush: true
            }), this.nodes.chart);
        } else {
            this.nodes.chartTitle.innerHTML = '';
            this.nodes.chart.innerHTML = '';
        }
    }

    async fetchData(url) {
        this.showPreloader(true);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                this.showPreloader(false);
                throw new Error('Server Error');
            }

            this.showPreloader(false);
            return await response.json();
        } catch (err) {
            this.showPreloader(false);
            console.log('Request error: ', err.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-coin').forEach((el) => {
        new Coin(el);
    });
});
