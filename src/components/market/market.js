// import template from 'lodash/template';
import { decimalFormat } from '../../js/utils';

export class Market {
    /**
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.el = el;
        this.el.Table = this;

        this.nodes = {
            root: this.el,
            currency: document.querySelector('.js-market-currency'),
            sort: document.querySelector('.js-market-sort'),
            perPage: document.querySelector('.js-market-per-page'),
            preloader: document.querySelector('.js-table-preloader'),
            pagination: document.querySelector('.js-market-pagination'),
            btcPrice: document.querySelector('.js-btc-price')
        };

        this.currency = this.el.dataset.currency || this.nodes.currency && this.nodes.currency[this.nodes.currency.selectedIndex].value || 'usd';
        this.sortBy = 'market_cap_desc';
        this.perPage = this.el.dataset.perPage || this.nodes.perPage && this.nodes.perPage[this.nodes.perPage.selectedIndex].value || 20;
        this.page = 1;
        this.graph = false;

        this.symbol = this.el.dataset.symbol || this.nodes.currency && this.nodes.currency.querySelector(`option[selected]`).dataset.symbol || '$';

        if (this.el.dataset.symbolPosition === 'end') {
            this.symbolPos = 'end'
        } else {
            this.symbolPos = this.nodes.currency && this.nodes.currency.querySelector(`option[selected]`).dataset.symbolStart === undefined ? 'end' : 'start';
        }

        this.decimal = this.el.dataset.decimal || this.nodes.currency && this.nodes.currency.querySelector(`option[selected]`).dataset.dec || 8;

        this.init();
    }

    init() {
        this.initTable();
        this.setListeners();
    }

    setListeners() {
        if (this.nodes.currency) {
            this.nodes.currency.addEventListener('change', e => this.setCurrency( e.target.value));
        }

        if (this.nodes.currency) {
            this.nodes.perPage.addEventListener('change', e => this.setPerPage( e.target.value));
        }
    }

    async initTable() {
        const data = await this.getTableData();

        if (data.length && this.nodes.btcPrice) {
            this.nodes.btcPrice.innerHTML = decimalFormat(data.filter(item => item.id === 'bitcoin')[0].current_price, 0);
        }

        this.renderTable(data);
    }

    setCurrency(currency) {
        const current = this.nodes.currency.querySelector(`option[value=${currency}]`);

        this.currency = currency;
        this.decimal = current.dataset.dec || 8;
        this.symbol = current.dataset.symbol;
        this.symbolPos = current.dataset.symbolStart !== undefined ? 'start' : 'end';
        this.initTable();
    }

    setSort(sortBy) {
        console.log('sortBy ', sortBy);
    }

    setPage(page) {
        console.log('numberPage ', page);
    }

    setPerPage(perPage) {
        if (this.perPage === perPage) return;

        this.perPage = perPage;
        this.initTable();
    }

    clearTableBody() {
        if (this.nodes.root.querySelector('tbody')) {
            this.nodes.root.querySelector('tbody').remove();
        }
    }

    renderTable(data) {
        const CS = this.symbol;
        const P = this.symbolPos;
        const D = this.decimal;
        const tableHead = `
            <thead>
                <tr>
                    <th>#</th>
                    <th>Coin</th>
                    <th style="text-align: right">Price</th>
                    <th style="text-align: right">Change (24h)</th>
                    <th style="text-align: right"">Volume (24h)</th>
                    <th style="text-align: right"">Market Cap</th>
                </tr>
            </thead>`;

        const paintCell = (cell) => (
            cell > 0
            ? `<td class="text-success" style="text-align: right">
                ${decimalFormat(cell)}%
            </td>`
            : `<td class="text-danger" style="text-align: right">
                ${decimalFormat(cell)}%
            </td>`
        );

        const tableRow = (row) => (
            `<tr>
                <td>${row.market_cap_rank}</td>
                <td style="padding-top:0;padding-bottom:0;">
                    <div>${row.symbol.toUpperCase()}</div>
                    <div class="text-black-50" style="margin-top:-5px;font-size:0.8em">${row.name}</div>
                </td>
                <td style="text-align: right">
                    ${P !== 'end' ? `${CS} <b>${decimalFormat(row.current_price, D)}</b>` : `<b>${ decimalFormat(row.current_price, D) }</b> ${ CS }`}
                </td>
                ${paintCell(row.price_change_percentage_24h)}
                <td style="text-align: right"">${P !== 'end' ? `${CS} ${decimalFormat(row.total_volume)}` : `${ decimalFormat(row.total_volume) } ${ CS }`}</td>
                <td style="text-align: right"">${P !== 'end' ? `${CS} ${decimalFormat(row.market_cap)}` : `${ decimalFormat(row.market_cap) } ${ CS }`}</td>
            </tr>`
        );

        const container = this.nodes.root.querySelector('.table');

        if (!container) {
            const table = document.createElement('table');
            const tableBody = document.createElement('tbody');

            table.classList.add('table');
            table.innerHTML = tableHead;
            data.forEach(item => tableBody.insertAdjacentHTML('beforeend', tableRow(item)));
            table.append(tableBody);
            this.nodes.root.append(table);
        } else {
            const tableBody = document.createElement('tbody');

            data.forEach(item => tableBody.insertAdjacentHTML('beforeend', tableRow(item)));
            this.clearTableBody();
            container.append(tableBody);
        }
    }

    async getTableData() {
        const API = 'https://api.coingecko.com/api/v3/coins/markets';
        const PARAMS = `?vs_currency=${ this.currency }&order=${ this.sortBy }&per_page=${ this.perPage }&page=${ this.page }&sparkline=${ this.graph }`

        return await this.fetchData(API + PARAMS);
    }

    async getGlobalData() {
        const API = 'https://api.coingecko.com/api/v3/global';

        return await this.fetchData(API);
    }

    async fetchData(url) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Ошибка сервера');
            }

            return await response.json();
        } catch (err) {
            console.log('Ошибка запроса: ', err.message);
        }
    }
}

// async initCurrencySelector() {
//     const data = await this.getCurrenciesListData();
//
//     this.renderCurrencySelector(data);
// }

// renderCurrencySelector(data) {
//     // this.nodes.currency.querySelector('select').remove();
//
//     // const select = document.createElement('select');
//     const currentList = ['usd', 'uer', 'rub'];
//
//     data
//         .filter(item => !currentList.includes(item))
//         .forEach(item => this.nodes.currency
//             .insertAdjacentHTML('beforeend', `<option value="${item}">${item.toUpperCase()}</option>`));
//
//     // this.nodes.currency.append(select);
//     // this.nodes.root.append(select);
//     console.log(this.nodes.currency);
// }

// async getCurrenciesListData() {
//     const API = 'https://api.coingecko.com/api/v3/simple/supported_vs_currencies';
//
//     return await this.fetchData(API);
// }

// /* PUBLIC section */
//
// /**
//  * Собирает новые строки таблицы
//  * @public
//  *
//  * @param {Array<{}>} items - данные строк
//  * @param {Boolean} keepPrev - сохранять ли предыдущие строки
//  */
// buildRows(items, keepPrev) {
//     if (!this.tmpl) return;
//
//     let newRows = '';
//
//     if (!items.length) {
//         this.el.classList.add('is-empty');
//     } else {
//         this.el.classList.remove('is-empty');
//     }
//
//     items.forEach((item) => {
//         newRows += template(this.tmpl)(item);
//     });
//
//     if (keepPrev) {
//         this.nodes.rowsWrapper.innerHTML += newRows;
//     } else {
//         this.nodes.rowsWrapper.innerHTML = newRows;
//     }
//
//     this.nodes.rows = this.el.querySelectorAll('.js-table-row');
// }
//
// /**
//  * @public
//  */
// getSort() {
//     return this.getActiveBtn().dataset.sort;
// }
//
// /**
//  * @public
//  */
// getDirection() {
//     return this.getActiveBtn().dataset.direction;
// }
//
// /**
//  * @public
//  * Изменение сортировки
//  * @param {string} sort - id кнопки сортировки
//  * @param {('asc'|'desc')} dir - направление сортировки, перебивает направление на кнопке
//  */
// changeSort(sort, dir) {
//     const btn = this.nodes.sortBtns.find(item => item.dataset.sort === sort);
//
//     if (btn) {
//         let { direction } = btn.dataset;
//
//         if (btn.classList.contains('is-active')) {
//             // меняем направление сортировки на противоположное, если кнопка уже активна
//             direction = direction === 'asc' ? 'desc' : 'asc';
//         }
//
//         // меняем состояние кнопок
//         this.changeBtnState(btn, direction || dir);
//     }
// }
//
// /* INIT section */
//
//
//
//
//
// initTooltip() {
//     this.tooltips = [];
//
//     this.el.querySelectorAll('.js-tooltip').forEach((tooltip) => {
//         this.tooltips.push(new Tooltip(tooltip));
//     });
// }
//
// /* PRIVATE section */
//
// getActiveBtn() {
//     return this.nodes.sortBtns.find(btn => btn.classList.contains('is-active'));
// }
//
// /**
//  * @private
//  * Обработчик клика по таблице
//  * */
// clickHandler(e) {
//     const sortBtn = e.target.closest('.js-table-sort-btn');
//
//     if (sortBtn) {
//         this.changeSort(sortBtn.dataset.sort);
//
//         // вызов коллбэка смены сортировки
//         this.sortCb(this.getSort(), this.getDirection());
//     }
// }
//
// /**
//  * @private
//  * Меняет состояние кнопки (класс и атрибут)
//  * @param {HTMLElement} btn - кнопка, состояние которой меняется
//  * @param {('asc'|'desc')} state - название состояния
//  */
// changeBtnState(btn, state) {
//     this.nodes.sortBtns.forEach((item) => {
//         item.classList.remove('is-active');
//         item.setAttribute('aria-pressed', false);
//     });
//
//     btn.classList.remove('asc', 'desc');
//     btn.classList.add(state);
//     btn.classList.add('is-active');
//     btn.setAttribute('aria-pressed', true);
//     btn.dataset.direction = state;
// }


const data = [
    {
        "id": "bitcoin",
        "symbol": "btc",
        "name": "Bitcoin",
        "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
        "current_price": 10523.05,
        "market_cap": 194547620768,
        "market_cap_rank": 1,
        "fully_diluted_valuation": 220983951991,
        "total_volume": 20457681760,
        "high_24h": 10548.35,
        "low_24h": 10284.82,
        "price_change_24h": 161.97,
        "price_change_percentage_24h": 1.56328,
        "market_cap_change_24h": 2889120454,
        "market_cap_change_percentage_24h": 1.50743,
        "circulating_supply": 18487768,
        "total_supply": 21000000,
        "max_supply": 21000000,
        "ath": 19665.39,
        "ath_change_percentage": -46.48953,
        "ath_date": "2017-12-16T00:00:00.000Z",
        "atl": 67.81,
        "atl_change_percentage": 15418.65583,
        "atl_date": "2013-07-06T00:00:00.000Z",
        "roi": null,
        "last_updated": "2020-09-13T05:18:56.175Z"
    },
    {
        "id": "ethereum",
        "symbol": "eth",
        "name": "Ethereum",
        "image": "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
        "current_price": 386.55,
        "market_cap": 43517992779,
        "market_cap_rank": 2,
        "fully_diluted_valuation": null,
        "total_volume": 12686594135,
        "high_24h": 389.45,
        "low_24h": 366.27,
        "price_change_24h": 15.1,
        "price_change_percentage_24h": 4.06559,
        "market_cap_change_24h": 1652125646,
        "market_cap_change_percentage_24h": 3.94624,
        "circulating_supply": 112580737.8115,
        "total_supply": null,
        "max_supply": null,
        "ath": 1448.18,
        "ath_change_percentage": -73.30793,
        "ath_date": "2018-01-13T00:00:00.000Z",
        "atl": 0.432979,
        "atl_change_percentage": 89176.74227,
        "atl_date": "2015-10-20T00:00:00.000Z",
        "roi": {
            "times": 48.07579824399237,
            "currency": "btc",
            "percentage": 4807.579824399237
        },
        "last_updated": "2020-09-13T05:19:46.750Z"
    },
    {
        "id": "tether",
        "symbol": "usdt",
        "name": "Tether",
        "image": "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
        "current_price": 1,
        "market_cap": 14718956409,
        "market_cap_rank": 3,
        "fully_diluted_valuation": null,
        "total_volume": 35094915298,
        "high_24h": 1,
        "low_24h": 0.999372,
        "price_change_24h": -0.00029767,
        "price_change_percentage_24h": -0.02975,
        "market_cap_change_24h": 21733940,
        "market_cap_change_percentage_24h": 0.14788,
        "circulating_supply": 14715332611.0702,
        "total_supply": 10166574840,
        "max_supply": null,
        "ath": 1.32,
        "ath_change_percentage": -24.40104,
        "ath_date": "2018-07-24T00:00:00.000Z",
        "atl": 0.572521,
        "atl_change_percentage": 74.7091,
        "atl_date": "2015-03-02T00:00:00.000Z",
        "roi": null,
        "last_updated": "2020-09-13T05:09:49.316Z"
    },
];
