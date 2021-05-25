import debounce from 'lodash/debounce';
import { Chart } from '../chart/chart';
import { decimalFormat } from '../../js/utils';

const element = React.createElement;
const MARKET_API = 'https://api.coingecko.com/api/v3';

export class Converter {
    /**
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.el = el;
        this.el.Converter = this;

        this.nodes = {
            dropdown: this.el.querySelectorAll('.dropdown-toggle'),
            dropdownCoins: this.el.querySelector('[data-converter-coins]').parentNode.querySelector('.dropdown-menu'),
            dropdownCurrencies: this.el.querySelector('[data-converter-currencies]').parentNode.querySelector('.dropdown-menu'),
            btnGroup: this.el.querySelectorAll('.js-converter-buttons'),
            priceCoin: this.el.querySelector('.js-converter-coin-price'),
            priceCurrency: this.el.querySelector('.js-converter-currency-price'),
            inputCoin: this.el.querySelector('.js-converter-input-coin'),
            inputCurrency: this.el.querySelector('.js-converter-input-currency'),
            actualDate: this.el.querySelector('.js-converter-actual-date'),
            popular: document.querySelector('.js-converter-popular'),
            coin: document.querySelectorAll('.js-converter-coin'),
            currency: document.querySelectorAll('.js-converter-currency'),
            price: document.querySelectorAll('.js-converter-price'),
            change: document.querySelectorAll('.js-converter-change'),
            image: document.querySelector('.js-converter-coin-image')
        };

        this.coin = 'bitcoin';
        this.currency = 'usd';
        this.price = null;

        this.init();
    }

    init() {
        // this.getCoinChartData(this.coin, this.currency);
        this.getConverterData();
        this.setListeners();
    }

    setListeners() {
        this.nodes.dropdownCoins.querySelector('input').addEventListener('keyup',
            debounce(e => this.dropdownInputHandler(e.target.value), 1000, {leading: true})
        );
        // Disable hide dropdown on label click
        this.nodes.dropdownCoins.querySelector('.converter-search__label').addEventListener('click',
            e => e.stopPropagation()
        );
        // Highlight input value on click
        this.nodes.dropdownCoins.querySelector('input').addEventListener('click',
            e => e.currentTarget.select()
        );

        this.nodes.btnGroup.forEach(item => {
            item.addEventListener('click', e => {
                if (e.target.dataset.coinId || e.target.dataset.currencyId || (e.target.closest('[data-coin-id]') && e.target.closest('[data-coin-id]').dataset.coinId)) {
                    if (e.target.tagName.toLowerCase() !== 'button') {
                        this.btnClickHandler(e.target.closest('button'))
                    } else {
                        this.btnClickHandler(e.target)
                    }
                }
            });
        });

        this.nodes.dropdown.forEach(item => {
            item.addEventListener('show.bs.dropdown', e => {
                if (e.target.dataset.converterCurrencies) {
                    this.renderDropdownCurrencies(e.target.dataset.converterCurrencies);
                } else if (e.target.dataset.converterCoins) {
                    this.initCoinsListData(e.target.dataset.converterCoins);
                }
            });
        });

        [this.nodes.inputCoin, this.nodes.inputCurrency].forEach(item => {
            item.addEventListener('keyup',
                debounce(e => this.coinInputHandler(e.target), 1000)
            );
        });

        [this.nodes.inputCoin, this.nodes.inputCurrency].forEach(item => {
            item.addEventListener('blur', e => {
                    const val = e.target.value.trim()
                        .replace(/[^0-9+.,]/g, '')
                        .replace(/,/g, '.')
                        .replace(/^([^.]*\.)|\./g, '$1');

                    const isInputCoin = item.classList.contains('js-converter-input-coin');

                    e.target.value = decimalFormat(val, isInputCoin ? 8 : this.defineFiat(this.currency) ? 2 : 8);
                }
            );
        });
    }

    renderChart(data) {
        const root = document.querySelector('#chart-root');
        const getDate = time => {
            const months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const date = new Date(time);
            const month = date.getMonth();
            const day = date.getDate();

            return `${ day } ${ months_arr[month] }`;
        };

        const removeDoubleDay = arr => {
            const dateArr = [];
            let day = '';

            arr.forEach(item => {
                if (day !== item.name) {
                    day = item.name;
                    dateArr.push(item)
                } else {
                    dateArr.pop();
                    dateArr.push(item);
                }
            })

            return dateArr;
        }

        ReactDOM.render(element(Chart, {
            data: removeDoubleDay(data.map(item => ({name: getDate(item[0]), price: this.defineFiat(this.currency) ? +item[1].toFixed(2) : +item[1].toFixed(8)}))),
            isFiat: this.defineFiat(this.currency),
            currency: this.currency.toUpperCase()
        }), root);
    }

    async initCoinsListData(initCoins) {
        // TODO Add timestamp

        const coinsList = localStorage.getItem('coinsList');
        const coinsListTimestamp = localStorage.getItem('coinsListTimestamp');

        if (!coinsList) {
            const data = await this.getCoinsListData();

            this.renderInitCoinsList(initCoins, data);
            localStorage.setItem('coinsList', JSON.stringify(data));
        } else {
            this.renderInitCoinsList(initCoins, JSON.parse(coinsList));
        }
    }

    renderInitCoinsList(initCoins, coinsList) {
        if (coinsList && !this.el.querySelectorAll('.js-converter-coins-init .converter-coins__item').length) {
            const setInitCoins = initCoins.split(',');
            const root = this.nodes.dropdownCoins.querySelector('.js-converter-coins-init');
            const list = document.createElement('div');
            const el = ({id, name, symbol}) => (`
                <button
                    type="button"
                    data-coin-id="${ id }"
                    class="btn converter-coins__item"
                >
                    <span class="converter-coins__symbol" title="${ symbol.toUpperCase() }">${ symbol.toUpperCase() }</span>&nbsp;
                    <span class="converter-coins__name" title="${ name }">(${ name })</span>
                </button>
            `);

            list.classList.add('converter-coins__list');
            coinsList.filter(item => setInitCoins.includes(item.id)).forEach(item => list.insertAdjacentHTML('beforeend', el(item)));
            root.innerHTML = '';
            root.append(list);
        }
    }

    renderDropdownCoins(coins) {
        const result = this.nodes.dropdownCoins.querySelector('.js-converter-coins-result');

        if (coins.length) {
            const list = document.createElement('div');
            const el = ({id, name, symbol}) => (`
                <button
                    type="button"
                    data-coin-id="${ id }"
                    class="btn converter-coins__item"
                >
                    <span class="converter-coins__symbol" title="${ symbol.toUpperCase() }">${ symbol.toUpperCase() }</span>&nbsp;
                    <span class="converter-coins__name" title="${ name }">(${ name })</span>&nbsp;
                </button>
            `);
            list.classList.add('converter-coins__list');
            coins.forEach(item => list.insertAdjacentHTML('beforeend', el(item)));
            result.innerHTML = '';
            result.append(list);
        } else {
            result.innerHTML = `<div class="px-2 pb-2">Found Nothing...</div>`;
        }
    }

    async renderDropdownCurrencies(initCoins) {
        const initCurrencies = initCoins.split(',');
        const cutCurrencies = [...initCurrencies, 'usd', 'eur'];

        if (!this.el.querySelectorAll('.js-converter-currencies-init .converter-currencies__item').length) {
            const data = await this.getCurrenciesListData();
            const root = this.nodes.dropdownCurrencies.querySelector('.js-converter-currencies-init');

            const list = document.createElement('div');
            const el = (item) => (`
                <button
                    type="button"
                    data-currency-id="${ item }"
                    class="btn converter-currencies__item"
                >
                    ${ item.toUpperCase() }
                </button>
            `);

            list.classList.add('converter-currencies__list');
            // In first add main currencies from HTML data-attribute
            initCurrencies.forEach(item => list.insertAdjacentHTML('beforeend', el(item)));
            // Delete initial currencies and add items in list
            data.filter(item => !cutCurrencies.includes(item)).forEach(item => list.insertAdjacentHTML('beforeend', el(item)));
            root.innerHTML = '';
            root.append(list);
        }
    }

    renderInputPrice(data, inputId) {
        if (data) {
            const coinValue = decimalFormat(data[this.coin][this.currency], this.defineFiat(this.currency) ? 2 : 8);
            const currencyValue = decimalFormat(1 / data[this.coin][this.currency], this.defineFiat(data[this.coin][this.currency]) ? 2 : 8);
            const currentPrice = data[this.coin][this.currency];

            this.nodes.priceCoin.innerHTML = `<div class="converter__price">1 ${ this.defineCoinById(this.coin).symbol.toUpperCase() } = ${ coinValue } ${ this.currency.toUpperCase() }</div>`;
            this.nodes.priceCurrency.innerHTML = `<div class="converter__price">1 ${ this.currency.toUpperCase() } = ${ currencyValue } ${ this.defineCoinById(this.coin).symbol.toUpperCase() }</div>`;

                this.nodes.inputCurrency.value = decimalFormat(currentPrice * this.nodes.inputCoin.value, this.defineFiat(this.currency) ? 2 : 8);
            this.price = currentPrice;
        }
    }

    renderActualDate(time) {
        const type = this.nodes.actualDate.dataset.standartType;
        const months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date = new Date(time * 1000);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = '0' + date.getMinutes();
        const seconds = '0' + date.getSeconds();

        if (type === '1') {
            this.nodes.actualDate.innerHTML = `${ months_arr[month] } ${ day }, ${ year } (${ hours }:${ minutes.substr(-2) }:${ seconds.substr(-2) })`;
        } else {
            this.nodes.actualDate.innerHTML = `${ day }.${ '0' + (month + 1) }.${ year } (${ hours }:${ minutes.substr(-2) }:${ seconds.substr(-2) })`;
        }
    }

    renderPopular(data) {
        const table = this.nodes.popular.querySelector('table');
        const tableBody = document.createElement('tbody');

        const tableHead = `
            <thead>
                <tr>
                    <th class="converter-popular__col converter-popular__col_1">Coin</th>
                    <th class="converter-popular__col converter-popular__col_2">${ this.currency.toUpperCase() }</th>
                    <th class="converter-popular__col converter-popular__col_3">1/${ this.currency.toUpperCase() }</th>
                </tr>
            </thead>`;

        const el = (item) => (`
                <tr>
                    <td class="converter-popular__col converter-popular__col_1">${ this.defineCoinById(item).symbol.toUpperCase() }</td>
                    <td class="converter-popular__col converter-popular__col_2">${ decimalFormat(data[item][this.currency], this.defineFiat(this.currency) ? 2 : 8) }</td>
                    <td class="converter-popular__col converter-popular__col_3">${ decimalFormat(1 / data[item][this.currency], this.defineFiat(item) ? 2 : 8) }</td>
                </tr>
            `);

        table.innerHTML = tableHead;
        // list.classList.add('converter-currencies__list');
        Object.keys(data).sort().forEach(item => tableBody.insertAdjacentHTML('beforeend', el(item)));
        table.append(tableBody);
    }

    renderCoinImage(image, name) {
        this.nodes.image.innerHTML = `<img src="${ image.large }" alt="${ name }"/>`;
    }

    dropdownInputHandler(val) {
        if (val.trim().length > 2) {

            if (localStorage.getItem('coinsList')) {
                const inputList = val.split(/\s|-/).filter((item) => item.length);
                const defineEntry = (el) => {
                    const entry = inputList.filter((item) => el.toLowerCase().indexOf(item.toLowerCase()) !== -1).length === inputList.length;

                    return !!entry;
                };
                const coins = JSON.parse(localStorage.getItem('coinsList')).filter((item) => defineEntry(item.id) || defineEntry(item.symbol) || defineEntry(item.name));

                this.renderDropdownCoins(coins);
                this.showCoinsResult(true);
            } else {
                this.initCoinsListData();
            }

        } else {
            this.showCoinsResult(false);
        }
    }

    coinInputHandler(input) {
        const val = input.value.trim()
            .replace(/[^0-9+.,]/g, '')
            .replace(/,/g, '.')
            .replace(/^([^.]*\.)|\./g, '$1');

        if (input.classList.contains('js-converter-input-coin')) {
            this.nodes.inputCurrency.value = decimalFormat(this.price * val, this.defineFiat(this.currency) ? 2 : 8);
        } else if (input.classList.contains('js-converter-input-currency')) {
            this.nodes.inputCoin.value = decimalFormat(val / this.price, this.defineFiat(this.coin) ? 2 : 8);
        }
    }

    showCoinsResult(bool) {
        const initResult = this.nodes.dropdownCoins.querySelector('.js-converter-coins-init');
        const result = this.nodes.dropdownCoins.querySelector('.js-converter-coins-result');

        if (bool) {
            initResult.classList.add('d-none');
            result.classList.remove('d-none');
        } else {
            initResult.classList.remove('d-none');
            result.classList.add('d-none');
        }
    }

    /**
     * Button click handler
     * @param btn {HTMLElement} - button element
     */
    btnClickHandler(btn) {
        // Separate dropdown buttons from single button
        if (btn.closest('.dropdown-menu')) {
            this.btnGroupHandler(btn);
        } else {
            // Set selected coin
            if (btn.dataset.coinId && btn.dataset.coinId !== this.coin) {
                this.coin = btn.dataset.coinId;
                this.getConverterData();
            }
            // Set selected currency
            if (btn.dataset.currencyId && btn.dataset.currencyId !== this.currency) {
                this.currency = btn.dataset.currencyId;
                this.getConverterData();
            }
            this.btnSetActive(btn);
        }
    }

    /**
     *
     * @param btn
     */
    btnGroupHandler(btn) {
        const btnGroup = btn.closest('.btn-group:not(.js-converter-buttons)');

        if (btn.dataset.coinId) {
            btnGroup.querySelector('[data-coin-id]').dataset.coinId = btn.dataset.coinId;
            btnGroup.querySelector('[data-coin-id]').innerHTML = this.defineCoinById(btn.dataset.coinId).symbol.toUpperCase();
        } else if (btn.dataset.currencyId) {
            btnGroup.querySelector('[data-currency-id]').dataset.currencyId = btn.dataset.currencyId;
            btnGroup.querySelector('[data-currency-id]').innerHTML = btn.dataset.currencyId.toUpperCase();
        }

        btn.closest('.js-converter-buttons')
            .querySelectorAll('button').forEach(item => {
            item.classList.remove('active');
        });

        btn.closest('.btn-group:not(.js-converter-buttons)')
            .querySelectorAll('button:not(.converter-coins__item)')
            .forEach(item => item.classList.add('active'));
        // Set selected coin
        if (btn.dataset.coinId && btn.dataset.coinId !== this.coin) {
            this.coin = btn.dataset.coinId;
            this.getConverterData();
        }
        // Set selected currency
        if (btn.dataset.currencyId && btn.dataset.currencyId !== this.currency) {
            this.currency = btn.dataset.currencyId;
            this.getConverterData();
        }
    }

    btnSetActive(btn) {
        btn.closest('.js-converter-buttons')
            .querySelectorAll('button').forEach(item => {
            item.classList.remove('active');
        });

        if (btn.closest('.btn-group:not(.js-converter-buttons)')) {
            btn.closest('.js-converter-buttons')
                .querySelectorAll('button').forEach(item => {
                item.classList.remove('active');
            });

            btn.closest('.btn-group:not(.js-converter-buttons)')
                .querySelectorAll('button:not(.converter-coins__item)')
                .forEach(item => item.classList.add('active'));
        } else {
            btn.classList.add('active');
        }
    }

    defineCoinById(id) {
        return JSON.parse(localStorage.getItem('coinsList')).filter((item) => item.id === id)[0];
    }

    defineFiat(currency) {
        const fiat = [
            'usd', 'aed', 'ars', 'aud', 'bdt', 'bhd', 'bmd', 'brl', 'cad', 'chf',
            'clp', 'cny', 'czk', 'dkk', 'eur', 'gbp', 'hkd', 'huf', 'idr', 'ils',
            'inr', 'jpy', 'krw', 'kwd', 'lkr', 'mmk', 'mxn', 'myr', 'ngn', 'nok',
            'nzd', 'php', 'pkr', 'pln', 'rub', 'sar', 'sek', 'sgd', 'thb', 'try',
            'twd', 'uah', 'vef', 'vnd', 'zar', 'xdr', 'xag', 'xau'
        ];

        return fiat.includes(currency);
    }

    showPreloader(bool) {
        bool
        ? this.el.closest('.row').classList.add('loading')
        : this.el.closest('.row').classList.remove('loading');
    }

    async getCurrenciesListData() {
        const API = `${ MARKET_API }/simple/supported_vs_currencies`;

        return await this.fetchData(API);
    }

    async getCoinsListData() {
        const API = `${ MARKET_API }/coins/list`;

        return await this.fetchData(API);
    }

    async getConverterData(inputId) {
        const popularCoins = this.el.querySelector('[data-converter-coins]').dataset.converterCoins.split(',');
        const coins = new Set(['bitcoin', 'ethereum', this.coin, ...popularCoins]);
        const API = `${ MARKET_API }/simple/price`;
        const PARAMS = `?ids=${ [...coins].join(',') }&vs_currencies=${ this.currency }&include_last_updated_at=true`;
        const data = await this.fetchData(API + PARAMS);

        this.renderPopular(data);
        this.renderInputPrice(data);
        this.renderActualDate(data[this.coin].last_updated_at);
        this.getCoinChartData(this.coin, this.currency);
        this.getCoinInfoData(this.coin);
    }

    async getCoinChartData(coin, currency, days = 7, daily = true) {
        const API = `${ MARKET_API }/coins/${ coin }/market_chart`;
        const PARAMS = `?vs_currency=${ currency }&days=${ days }${ daily ? '&interval=daily' : '' }`;
        const data = await this.fetchData(API + PARAMS);

        if (data) {
            const defineChange = (start, end) => {
                // console.log((end * 100 / start) - 100);

                if (start > end) {
                    return `<span class="text-danger">${ decimalFormat(Math.abs(start - end), this.defineFiat(this.currency) ? 2 : 8) } (${ ((end * 100 / start) - 100).toFixed(2) }%)</span>`;
                } else {
                    return `<span class="text-success">${ decimalFormat(Math.abs(start - end), this.defineFiat(this.currency) ? 2 : 8) } (+${ ((end * 100 / start) - 100).toFixed(2) }%)</span>`;
                }
            };

            this.renderChart(data.prices);

            this.nodes.price.forEach(item => item.innerHTML = `${ decimalFormat(data.prices[data.prices.length - 1][1], this.defineFiat(this.currency) ? 2 : 8) } ${ this.currency.toUpperCase() }`);
            this.nodes.change.forEach(item => item.innerHTML = defineChange(data.prices[0][1], data.prices[data.prices.length - 1][1]));
        }

        this.nodes.coin.forEach(item => item.innerHTML = this.coin.charAt(0).toUpperCase() + this.coin.slice(1));
        this.nodes.currency.forEach(item => item.innerHTML = this.currency.toUpperCase());
    }

    async getCoinInfoData(coin) {
        const API = `${ MARKET_API }/coins/${ coin }`;
        const PARAMS = `?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`;
        const data = await this.fetchData(API + PARAMS);

        if (data) {
            this.renderCoinImage(data.image, data.name);
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
    document.querySelectorAll('.js-converter').forEach((el) => {
        new Converter(el);
    });
});
