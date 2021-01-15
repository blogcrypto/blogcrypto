// import template from 'lodash/template';
import { decimalFormat } from '../../js/utils';

const MARKET_API = 'https://api.coingecko.com/api/v3';

export class Market {
    /**
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.el = el;
        this.el.Table = this;

        this.nodes = {
            wrapper: document.querySelector('.js-market-wrapper'),
            currency: document.querySelector('.js-market-currency'),
            sort: document.querySelector('.js-market-sort'),
            perPage: document.querySelector('.js-market-per-page'),
            preloader: document.querySelector('.js-table-preloader'),
            pagination: document.querySelectorAll('.js-market-pagination'),
            btcPrice: document.querySelector('.js-btc-price'),
            marketCoins: document.querySelector('.js-market-cains-count'),
            marketCap: document.querySelector('.js-market-cap'),
            marketVol: document.querySelector('.js-market-vol'),
            marketDominance: document.querySelector('.js-market-dominance'),
        };

        this.marketGlobal = null;
        this.currency = this.el.dataset.currency || this.nodes.currency && this.nodes.currency[this.nodes.currency.selectedIndex].value || 'usd';
        this.perPage = this.el.dataset.perPage || this.nodes.perPage && this.nodes.perPage[this.nodes.perPage.selectedIndex].value || 20;
        this.page = 1;
        this.graph = false;
        this.sort = {
            by: 'rank',
            order: 'asc'
        };
        this.symbol = this.el.dataset.symbol || this.nodes.currency && this.nodes.currency.querySelector(`option[selected]`).dataset.symbol || '$';

        if (this.el.dataset.symbolPosition === 'end') {
            this.symbolPos = 'end';
        } else {
            this.symbolPos = this.nodes.currency && this.nodes.currency.querySelector(`option[selected]`).dataset.symbolStart === undefined ? 'end' : 'start';
        }

        this.decimal = this.el.dataset.decimal || this.nodes.currency && this.nodes.currency.querySelector(`option[selected]`).dataset.dec || 8;

        this.init();
    }

    init() {
        this.initGlobalData();
        this.initTable();
        this.setListeners();
    }

    setListeners() {
        if (this.nodes.currency) {
            this.nodes.currency.addEventListener('change', e => this.setCurrency(e.target.value));
        }

        if (this.nodes.currency) {
            this.nodes.perPage.addEventListener('change', e => this.setPerPage(e.target.value));
        }

        this.nodes.pagination.forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                if (e.target.classList.contains('page-link')) {
                    this.setPage(+e.target.innerHTML);
                }
            });
        });
    }

    async initGlobalData() {
        const {data} = await this.getGlobalData();

        this.marketGlobal = data;
        this.initPagination();

        if (this.nodes.marketCoins) this.nodes.marketCoins.innerHTML = decimalFormat(data.active_cryptocurrencies);
        if (this.nodes.marketCap) this.nodes.marketCap.innerHTML = `$${decimalFormat(data.total_market_cap.usd)}`;
        if (this.nodes.marketVol) this.nodes.marketVol.innerHTML = `$${decimalFormat(data.total_volume.usd)}`;
        if (this.nodes.marketDominance) this.nodes.marketDominance.innerHTML = `${Object.keys(data.market_cap_percentage)[0].toUpperCase()} ${decimalFormat(Object.values(data.market_cap_percentage)[0], 2)}%`
    }

    async initTable(sortBy = 'rank', sortOrder = 'asc') {
        const data = await this.getTableData();

        if (data.length && this.nodes.btcPrice) {
            this.nodes.btcPrice.innerHTML = decimalFormat(data.filter(item => item.id === 'bitcoin')[0].current_price, 0);
        }

        this.setSort(data, sortBy, sortOrder);
    }

    initPagination() {
        this.nodes.pagination.forEach(item => {
            this.renderPagination(item);
        });
    }

    setCurrency(currency) {
        const current = this.nodes.currency.querySelector(`option[value=${ currency }]`);

        this.currency = currency;
        this.decimal = current.dataset.dec || 8;
        this.symbol = current.dataset.symbol;
        this.symbolPos = current.dataset.symbolStart !== undefined ? 'start' : 'end';
        this.initTable(this.sort.by, this.sort.order);
    }

    setSort(data, sortBy, sortOrder) {
        this.sort = {
            by: sortBy,
            order: sortOrder
        };

        switch (this.sort.by) {
            case 'name':
                data.sort((a, b) => a.id - b.id);
                break;
            case 'price':
                data.sort((a, b) => a.current_price - b.current_price);
                break;
            case 'change_24h':
                data.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
                break;
            case 'change_7d':
                data.sort((a, b) => a.price_change_percentage_7d_in_currency - b.price_change_percentage_7d_in_currency);
                break;
            case 'change_1y':
                data.sort((a, b) => a.price_change_percentage_1y_in_currency - b.price_change_percentage_1y_in_currency);
                break;
            case 'volume':
                data.sort((a, b) => a.total_volume - b.total_volume);
                break;
            case 'cap':
                data.sort((a, b) => a.market_cap - b.market_cap);
                break;
            default:
                data.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
                break;
        }

        if (this.sort.order === 'desc') {
            data.reverse();
        }

        this.renderTable(data);
    }

    setPage(page) {
        if (this.page === page) return;

        this.page = page;
        this.initTable(this.sort.by, this.sort.order);
        this.initPagination();
    }

    setPerPage(perPage) {
        if (this.perPage === perPage) return;

        this.perPage = perPage;
        this.setPage(1);
        this.initTable(this.sort.by, this.sort.order);
        this.initPagination();
    }

    clearTableBody() {
        if (this.el.querySelector('tbody')) {
            this.el.querySelector('tbody').remove();
        }
    }

    renderTable(data) {
        const CS = this.symbol;
        const P = this.symbolPos;
        const D = this.decimal;
        const tableHead = `
            <thead>
                <tr>
                    <th data-sort-by="rank" data-sort-order="asc">#</th>
                    <th></th>
                    <th data-sort-by="name">Coin</th>
                    <th style="text-align: right" data-sort-by="price">Price</th>
                    <th style="text-align: right" data-sort-by="change_24h">24h</th>
                    <th style="text-align: right" data-sort-by="change_7d">7d</div></th>
                    <th style="text-align: right" data-sort-by="change_1y">Year</div></th>
                    <th style="text-align: right" data-sort-by="volume">Volume (24h)</th>
                    <th style="text-align: right;padding-right:1.1rem;" data-sort-by="cap">Market Cap</th>
                </tr>
            </thead>`;

        const paintCell = (cell) => (
            cell > 0
            ? `<td class="text-success" style="text-align: right">
                ${ decimalFormat(cell) }%
            </td>`
            : `<td class="text-danger" style="text-align: right">
                ${ decimalFormat(cell) }%
            </td>`
        );

        const localeLink = (id) => document.documentElement.lang !== 'en'
                                   ? `/${ document.documentElement.lang }/coin?${ id }`
                                   : `/coin?${ id }`;

        const tableRow = (row) => (
            `<tr id="${ row.id }">
                <td>${ row.market_cap_rank }</td>
                <td style="max-width:22px;max-height:22px;width:22px;height:22px;padding: 0;vertical-align: middle;text-align: center;">
                  <a href="${ localeLink(row.id) }"><img src="${ row.image }" alt="${ row.name }"></a>
                </td>
                <td style="padding-top:0;padding-bottom:0;padding-left:0">
                    <a href="${ localeLink(row.id) }" class="market-coin-link">
                        <div style="padding-left:.5rem">${ row.symbol.toUpperCase() }</div>
                        <div class="text-muted" style="margin-top:-5px;font-size:0.8em;padding-left:.5rem">${ row.name }</div>
                    </a>
                </td>
                <td style="text-align: right">
                    ${ P !== 'end' ? `${ CS } <b>${ decimalFormat(row.current_price, D) }</b>` : `<b>${ decimalFormat(row.current_price, D) }</b> ${ CS }` }
                </td>
                ${ paintCell(row.price_change_percentage_24h) }
                ${ paintCell(row.price_change_percentage_7d_in_currency) }
                ${ paintCell(row.price_change_percentage_1y_in_currency) }
                <td style="text-align: right"">${ P !== 'end' ? `${ CS } ${ decimalFormat(row.total_volume) }` : `${ decimalFormat(row.total_volume) } ${ CS }` }</td>
                <td style="text-align: right"">${ P !== 'end' ? `${ CS } ${ decimalFormat(row.market_cap) }` : `${ decimalFormat(row.market_cap) } ${ CS }` }</td>
            </tr>`
        );

        const container = this.el.querySelector('.table');

        if (!container) {
            const table = document.createElement('table');
            const tableBody = document.createElement('tbody');

            table.classList.add('table');
            table.innerHTML = tableHead;
            data.forEach(item => tableBody.insertAdjacentHTML('beforeend', tableRow(item)));
            table.append(tableBody);
            this.el.append(table);

            table.querySelector('thead').addEventListener('click', e => {
                if (e.target.dataset.sortBy) {
                    const isDesc = e.target.dataset.sortOrder && e.target.dataset.sortOrder === 'asc';
                    const headItems = this.el.querySelectorAll('thead [data-sort-by]');

                    headItems.forEach(item => {
                        delete item.dataset.sortOrder;
                    });

                    if (isDesc) {
                        e.target.dataset.sortOrder = 'desc';
                    } else {
                        e.target.dataset.sortOrder = 'asc';
                    }

                    this.initTable(e.target.dataset.sortBy, e.target.dataset.sortOrder || 'asc');
                }
            });

        } else {
            const tableBody = document.createElement('tbody');

            data.forEach(item => tableBody.insertAdjacentHTML('beforeend', tableRow(item)));
            this.clearTableBody();
            container.append(tableBody);
        }
    }

    renderPagination(item) {
        const listItems = document.createElement('ul');
        const maxPage = Math.ceil(this.marketGlobal.active_cryptocurrencies / this.perPage);

        item.innerHTML = '';
        listItems.classList.add('pagination', 'justify-content-sm-end');

        if (this.page < 5) {
            listItems.insertAdjacentHTML(
                'beforeend',
                `
                    <li class="page-item ${ this.page === 1 ? 'active' : '' }">
                       <a class="page-link" href="#">1</a>
                    </li>
                    <li class="page-item ${ this.page === 2 ? 'active' : '' }">
                       <a class="page-link" href="#">2</a>
                    </li>
                    <li class="page-item ${ this.page === 3 ? 'active' : '' }">
                       <a class="page-link" href="#">3</a>
                    </li>
                    <li class="page-item ${ this.page === 4 ? 'active' : '' }">
                       <a class="page-link" href="#">4</a>
                    </li>
                    <li class="page-item ${ this.page === 5 ? 'active' : '' }">
                       <a class="page-link" href="#">5</a>
                    </li>
                    <li class="page-item disabled">
                       <span class="page-link">...</span>
                    </li>
                    <li class="page-item">
                       <a class="page-link" href="#">${ maxPage }</a>
                    </li>
                `);
        } else if (this.page > maxPage - 4) {
            listItems.insertAdjacentHTML(
                'beforeend',
                `
                    <li class="page-item">
                       <a class="page-link" href="#">1</a>
                    </li>
                    <li class="page-item disabled">
                       <span class="page-link">...</span>
                    </li>
                    <li class="page-item ${ this.page === maxPage - 4 ? 'active' : '' }">
                       <a class="page-link" href="#">${ maxPage - 4 }</a>
                    </li>
                    <li class="page-item ${ this.page === maxPage - 3 ? 'active' : '' }">
                       <a class="page-link" href="#">${ maxPage - 3 }</a>
                    </li>
                    <li class="page-item ${ this.page === maxPage - 2 ? 'active' : '' }">
                       <a class="page-link" href="#">${ maxPage - 2 }</a>
                    </li>
                    <li class="page-item ${ this.page === maxPage - 1 ? 'active' : '' }">
                       <a class="page-link" href="#">${ maxPage - 1 }</a>
                    </li>
                    <li class="page-item ${ this.page === maxPage ? 'active' : '' }">
                       <a class="page-link" href="#">${ maxPage }</a>
                    </li>
                `);
        } else {
            listItems.insertAdjacentHTML(
                'beforeend',
                `
                    <li class="page-item">
                       <a class="page-link" href="#">1</a>
                    </li>
                    <li class="page-item disabled">
                       <span class="page-link">...</span>
                    </li>
                    <li class="page-item d-none d-md-block">
                       <a class="page-link" href="#">${ this.page - 2 }</a>
                    </li>
                    <li class="page-item">
                       <a class="page-link" href="#">${ this.page - 1 }</a>
                    </li>
                    <li class="page-item active">
                       <a class="page-link" href="#">${ this.page }</a>
                    </li>
                    <li class="page-item">
                       <a class="page-link" href="#">${ this.page + 1 }</a>
                    </li>
                    <li class="page-item d-none d-md-block">
                       <a class="page-link" href="#">${ this.page + 2 }</a>
                    </li>
                    <li class="page-item disabled">
                       <span class="page-link">...</span>
                    </li>
                    <li class="page-item">
                       <a class="page-link" href="#">${ maxPage }</a>
                    </li>
                `);
        }

        item.appendChild(listItems);
    }

    showPreloader(bool) {
        if (this.nodes.wrapper) {
            bool
            ? this.nodes.wrapper.classList.add('loading')
            : this.nodes.wrapper.classList.remove('loading');
        }
    }

    async getTableData() {
        const API = `${ MARKET_API }/coins/markets`;
        const PARAMS = `?vs_currency=${ this.currency }&order=market_cap_desc&per_page=${ this.perPage }&page=${ this.page }&price_change_percentage=24h,7d,1y&sparkline=${ this.graph }`;

        return await this.fetchData(API + PARAMS);
    }

    async getGlobalData() {
        const API = `${ MARKET_API }/global`;

        return await this.fetchData(API);
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
    document.querySelectorAll('.js-market').forEach((el) => {
        new Market(el);
    });

});
