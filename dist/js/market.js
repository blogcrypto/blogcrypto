!function(t){var e={};function n(r){if(e[r])return e[r].exports;var a=e[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)n.d(r,a,function(e){return t[e]}.bind(null,a));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=14)}([function(t,e,n){t.exports=n(12)},function(t,e){t.exports=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e){function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}t.exports=function(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t}},function(t,e){function n(t,e,n,r,a,i,o){try{var c=t[i](o),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,a)}t.exports=function(t){return function(){var e=this,r=arguments;return new Promise((function(a,i){var o=t.apply(e,r);function c(t){n(o,a,i,c,s,"next",t)}function s(t){n(o,a,i,c,s,"throw",t)}c(void 0)}))}}},,,,,,,,,function(t,e,n){var r=function(t){"use strict";var e=Object.prototype,n=e.hasOwnProperty,r="function"==typeof Symbol?Symbol:{},a=r.iterator||"@@iterator",i=r.asyncIterator||"@@asyncIterator",o=r.toStringTag||"@@toStringTag";function c(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{c({},"")}catch(t){c=function(t,e,n){return t[e]=n}}function s(t,e,n,r){var a=e&&e.prototype instanceof h?e:h,i=Object.create(a.prototype),o=new x(r||[]);return i._invoke=function(t,e,n){var r="suspendedStart";return function(a,i){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===a)throw i;return L()}for(n.method=a,n.arg=i;;){var o=n.delegate;if(o){var c=k(o,n);if(c){if(c===u)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var s=l(t,e,n);if("normal"===s.type){if(r=n.done?"completed":"suspendedYield",s.arg===u)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(r="completed",n.method="throw",n.arg=s.arg)}}}(t,n,o),i}function l(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=s;var u={};function h(){}function d(){}function p(){}var f={};f[a]=function(){return this};var g=Object.getPrototypeOf,y=g&&g(g(P([])));y&&y!==e&&n.call(y,a)&&(f=y);var v=p.prototype=h.prototype=Object.create(f);function m(t){["next","throw","return"].forEach((function(e){c(t,e,(function(t){return this._invoke(e,t)}))}))}function b(t,e){var r;this._invoke=function(a,i){function o(){return new e((function(r,o){!function r(a,i,o,c){var s=l(t[a],t,i);if("throw"!==s.type){var u=s.arg,h=u.value;return h&&"object"==typeof h&&n.call(h,"__await")?e.resolve(h.__await).then((function(t){r("next",t,o,c)}),(function(t){r("throw",t,o,c)})):e.resolve(h).then((function(t){u.value=t,o(u)}),(function(t){return r("throw",t,o,c)}))}c(s.arg)}(a,i,r,o)}))}return r=r?r.then(o,o):o()}}function k(t,e){var n=t.iterator[e.method];if(void 0===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,k(t,e),"throw"===e.method))return u;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return u}var r=l(n,t.iterator,e.arg);if("throw"===r.type)return e.method="throw",e.arg=r.arg,e.delegate=null,u;var a=r.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,u):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,u)}function _(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function w(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function x(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(_,this),this.reset(!0)}function P(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,i=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return i.next=i}}return{next:L}}function L(){return{value:void 0,done:!0}}return d.prototype=v.constructor=p,p.constructor=d,d.displayName=c(p,o,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===d||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,p):(t.__proto__=p,c(t,o,"GeneratorFunction")),t.prototype=Object.create(v),t},t.awrap=function(t){return{__await:t}},m(b.prototype),b.prototype[i]=function(){return this},t.AsyncIterator=b,t.async=function(e,n,r,a,i){void 0===i&&(i=Promise);var o=new b(s(e,n,r,a),i);return t.isGeneratorFunction(n)?o:o.next().then((function(t){return t.done?t.value:o.next()}))},m(v),c(v,o,"Generator"),v[a]=function(){return this},v.toString=function(){return"[object Generator]"},t.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},t.values=P,x.prototype={constructor:x,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(w),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(n,r){return o.type="throw",o.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],o=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var c=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(c&&s){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var a=this.tryEntries[r];if(a.tryLoc<=this.prev&&n.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var i=a;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var o=i?i.completion:{};return o.type=t,o.arg=e,i?(this.method="next",this.next=i.finallyLoc,u):this.complete(o)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),u},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),w(n),u}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var a=r.arg;w(n)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:P(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),u}},t}(t.exports);try{regeneratorRuntime=r}catch(t){Function("r","regeneratorRuntime = r")(r)}},,function(t,e,n){"use strict";n.r(e),n.d(e,"Market",(function(){return p}));var r=n(0),a=n.n(r),i=n(3),o=n.n(i),c=n(1),s=n.n(c),l=n(2),u=n.n(l),h=function(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:",",a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:" ";return t=+String(t).replace(/[^0-9+\-Ee.]/g,""),(e=n?String(Math.round(t*Math.pow(10,n))/Math.pow(10,n)).split("."):String(Math.round(t)).split("."))[0].length>3&&(e[0]=e[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,a)),e[1]&&e[1].length<n&&(e[1]+=new Array(n-e[1].length+1).join("0")),e.join(r)},d="https://api.coingecko.com/api/v3",p=function(){function t(e){s()(this,t),this.el=e,this.el.Table=this,this.nodes={wrapper:document.querySelector(".js-market-wrapper"),currency:document.querySelector(".js-market-currency"),sort:document.querySelector(".js-market-sort"),perPage:document.querySelector(".js-market-per-page"),preloader:document.querySelector(".js-table-preloader"),pagination:document.querySelectorAll(".js-market-pagination"),btcPrice:document.querySelector(".js-btc-price")},this.marketGlobal=null,this.currency=this.el.dataset.currency||this.nodes.currency&&this.nodes.currency[this.nodes.currency.selectedIndex].value||"usd",this.perPage=this.el.dataset.perPage||this.nodes.perPage&&this.nodes.perPage[this.nodes.perPage.selectedIndex].value||20,this.page=1,this.graph=!1,this.sort={by:"rank",order:"asc"},this.symbol=this.el.dataset.symbol||this.nodes.currency&&this.nodes.currency.querySelector("option[selected]").dataset.symbol||"$","end"===this.el.dataset.symbolPosition?this.symbolPos="end":this.symbolPos=this.nodes.currency&&void 0===this.nodes.currency.querySelector("option[selected]").dataset.symbolStart?"end":"start",this.decimal=this.el.dataset.decimal||this.nodes.currency&&this.nodes.currency.querySelector("option[selected]").dataset.dec||8,this.init()}var e,n,r,i,c;return u()(t,[{key:"init",value:function(){this.initGlobalData(),this.initTable(),this.setListeners()}},{key:"setListeners",value:function(){var t=this;this.nodes.currency&&this.nodes.currency.addEventListener("change",(function(e){return t.setCurrency(e.target.value)})),this.nodes.currency&&this.nodes.perPage.addEventListener("change",(function(e){return t.setPerPage(e.target.value)})),this.nodes.pagination.forEach((function(e){e.addEventListener("click",(function(e){e.preventDefault(),e.target.classList.contains("page-link")&&t.setPage(+e.target.innerHTML)}))}))}},{key:"initGlobalData",value:(c=o()(a.a.mark((function t(){var e,n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.getGlobalData();case 2:e=t.sent,n=e.data,this.marketGlobal=n,this.initPagination();case 6:case"end":return t.stop()}}),t,this)}))),function(){return c.apply(this,arguments)})},{key:"initTable",value:(i=o()(a.a.mark((function t(){var e,n,r,i=arguments;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=i.length>0&&void 0!==i[0]?i[0]:"rank",n=i.length>1&&void 0!==i[1]?i[1]:"asc",t.next=4,this.getTableData();case 4:(r=t.sent).length&&this.nodes.btcPrice&&(this.nodes.btcPrice.innerHTML=h(r.filter((function(t){return"bitcoin"===t.id}))[0].current_price,0)),this.setSort(r,e,n);case 7:case"end":return t.stop()}}),t,this)}))),function(){return i.apply(this,arguments)})},{key:"initPagination",value:function(){var t=this;this.nodes.pagination.forEach((function(e){t.renderPagination(e)}))}},{key:"setCurrency",value:function(t){var e=this.nodes.currency.querySelector("option[value=".concat(t,"]"));this.currency=t,this.decimal=e.dataset.dec||8,this.symbol=e.dataset.symbol,this.symbolPos=void 0!==e.dataset.symbolStart?"start":"end",this.initTable(this.sort.by,this.sort.order)}},{key:"setSort",value:function(t,e,n){switch(this.sort={by:e,order:n},this.sort.by){case"name":t.sort((function(t,e){return t.id-e.id}));break;case"price":t.sort((function(t,e){return t.current_price-e.current_price}));break;case"change_24h":t.sort((function(t,e){return t.price_change_percentage_24h-e.price_change_percentage_24h}));break;case"change_7d":t.sort((function(t,e){return t.price_change_percentage_7d_in_currency-e.price_change_percentage_7d_in_currency}));break;case"change_1y":t.sort((function(t,e){return t.price_change_percentage_1y_in_currency-e.price_change_percentage_1y_in_currency}));break;case"volume":t.sort((function(t,e){return t.total_volume-e.total_volume}));break;case"cap":t.sort((function(t,e){return t.market_cap-e.market_cap}));break;default:t.sort((function(t,e){return t.market_cap_rank-e.market_cap_rank}))}"desc"===this.sort.order&&t.reverse(),this.renderTable(t)}},{key:"setPage",value:function(t){this.page!==t&&(this.page=t,this.initTable(this.sort.by,this.sort.order),this.initPagination())}},{key:"setPerPage",value:function(t){this.perPage!==t&&(this.perPage=t,this.setPage(1),this.initTable(this.sort.by,this.sort.order),this.initPagination())}},{key:"clearTableBody",value:function(){this.el.querySelector("tbody")&&this.el.querySelector("tbody").remove()}},{key:"renderTable",value:function(t){var e=this,n=this.symbol,r=this.symbolPos,a=this.decimal,i=function(t){return t>0?'<td class="text-success" style="text-align: right">\n                '.concat(h(t),"%\n            </td>"):'<td class="text-danger" style="text-align: right">\n                '.concat(h(t),"%\n            </td>")},o=function(t){return"<tr>\n                <td>".concat(t.market_cap_rank,'</td>\n                <td style="max-width:22px;max-height:22px;width:22px;height:22px;padding: 0;vertical-align: middle;text-align: center;">\n                  <img src="').concat(t.image,'" alt="').concat(t.name,'">\n                </td>\n                <td style="padding-top:0;padding-bottom:0;">\n                    <div>').concat(t.symbol.toUpperCase(),'</div>\n                    <div class="text-muted" style="margin-top:-5px;font-size:0.8em">').concat(t.name,'</div>\n                </td>\n                <td style="text-align: right">\n                    ').concat("end"!==r?"".concat(n," <b>").concat(h(t.current_price,a),"</b>"):"<b>".concat(h(t.current_price,a),"</b> ").concat(n),"\n                </td>\n                ").concat(i(t.price_change_percentage_24h),"\n                ").concat(i(t.price_change_percentage_7d_in_currency),"\n                ").concat(i(t.price_change_percentage_1y_in_currency),'\n                <td style="text-align: right"">').concat("end"!==r?"".concat(n," ").concat(h(t.total_volume)):"".concat(h(t.total_volume)," ").concat(n),'</td>\n                <td style="text-align: right"">').concat("end"!==r?"".concat(n," ").concat(h(t.market_cap)):"".concat(h(t.market_cap)," ").concat(n),"</td>\n            </tr>")},c=this.el.querySelector(".table");if(c){var s=document.createElement("tbody");t.forEach((function(t){return s.insertAdjacentHTML("beforeend",o(t))})),this.clearTableBody(),c.append(s)}else{var l=document.createElement("table"),u=document.createElement("tbody");l.classList.add("table"),l.innerHTML='\n            <thead>\n                <tr>\n                    <th data-sort-by="rank" data-sort-order="asc">#</th>\n                    <th></th>\n                    <th data-sort-by="name">Coin</th>\n                    <th style="text-align: right" data-sort-by="price">Price</th>\n                    <th style="text-align: right" data-sort-by="change_24h">24h</th>\n                    <th style="text-align: right" data-sort-by="change_7d">7d</div></th>\n                    <th style="text-align: right" data-sort-by="change_1y">Year</div></th>\n                    <th style="text-align: right" data-sort-by="volume">Volume (24h)</th>\n                    <th style="text-align: right;padding-right:1.1rem;" data-sort-by="cap">Market Cap</th>\n                </tr>\n            </thead>',t.forEach((function(t){return u.insertAdjacentHTML("beforeend",o(t))})),l.append(u),this.el.append(l),l.querySelector("thead").addEventListener("click",(function(t){if(t.target.dataset.sortBy){var n=t.target.dataset.sortOrder&&"asc"===t.target.dataset.sortOrder;e.el.querySelectorAll("thead [data-sort-by]").forEach((function(t){delete t.dataset.sortOrder})),t.target.dataset.sortOrder=n?"desc":"asc",e.initTable(t.target.dataset.sortBy,t.target.dataset.sortOrder||"asc")}}))}}},{key:"renderPagination",value:function(t){var e=document.createElement("ul"),n=Math.ceil(this.marketGlobal.active_cryptocurrencies/this.perPage);t.innerHTML="",e.classList.add("pagination","justify-content-sm-end"),this.page<5?e.insertAdjacentHTML("beforeend",'\n                    <li class="page-item '.concat(1===this.page?"active":"",'">\n                       <a class="page-link" href="#">1</a>\n                    </li>\n                    <li class="page-item ').concat(2===this.page?"active":"",'">\n                       <a class="page-link" href="#">2</a>\n                    </li>\n                    <li class="page-item ').concat(3===this.page?"active":"",'">\n                       <a class="page-link" href="#">3</a>\n                    </li>\n                    <li class="page-item ').concat(4===this.page?"active":"",'">\n                       <a class="page-link" href="#">4</a>\n                    </li>\n                    <li class="page-item ').concat(5===this.page?"active":"",'">\n                       <a class="page-link" href="#">5</a>\n                    </li>\n                    <li class="page-item disabled">\n                       <span class="page-link">...</span>\n                    </li>\n                    <li class="page-item">\n                       <a class="page-link" href="#">').concat(n,"</a>\n                    </li>\n                ")):this.page>n-4?e.insertAdjacentHTML("beforeend",'\n                    <li class="page-item">\n                       <a class="page-link" href="#">1</a>\n                    </li>\n                    <li class="page-item disabled">\n                       <span class="page-link">...</span>\n                    </li>\n                    <li class="page-item '.concat(this.page===n-4?"active":"",'">\n                       <a class="page-link" href="#">').concat(n-4,'</a>\n                    </li>\n                    <li class="page-item ').concat(this.page===n-3?"active":"",'">\n                       <a class="page-link" href="#">').concat(n-3,'</a>\n                    </li>\n                    <li class="page-item ').concat(this.page===n-2?"active":"",'">\n                       <a class="page-link" href="#">').concat(n-2,'</a>\n                    </li>\n                    <li class="page-item ').concat(this.page===n-1?"active":"",'">\n                       <a class="page-link" href="#">').concat(n-1,'</a>\n                    </li>\n                    <li class="page-item ').concat(this.page===n?"active":"",'">\n                       <a class="page-link" href="#">').concat(n,"</a>\n                    </li>\n                ")):e.insertAdjacentHTML("beforeend",'\n                    <li class="page-item">\n                       <a class="page-link" href="#">1</a>\n                    </li>\n                    <li class="page-item disabled">\n                       <span class="page-link">...</span>\n                    </li>\n                    <li class="page-item d-none d-md-block">\n                       <a class="page-link" href="#">'.concat(this.page-2,'</a>\n                    </li>\n                    <li class="page-item">\n                       <a class="page-link" href="#">').concat(this.page-1,'</a>\n                    </li>\n                    <li class="page-item active">\n                       <a class="page-link" href="#">').concat(this.page,'</a>\n                    </li>\n                    <li class="page-item">\n                       <a class="page-link" href="#">').concat(this.page+1,'</a>\n                    </li>\n                    <li class="page-item d-none d-md-block">\n                       <a class="page-link" href="#">').concat(this.page+2,'</a>\n                    </li>\n                    <li class="page-item disabled">\n                       <span class="page-link">...</span>\n                    </li>\n                    <li class="page-item">\n                       <a class="page-link" href="#">').concat(n,"</a>\n                    </li>\n                ")),t.appendChild(e)}},{key:"showPreloader",value:function(t){this.nodes.wrapper&&(t?this.nodes.wrapper.classList.add("loading"):this.nodes.wrapper.classList.remove("loading"))}},{key:"getTableData",value:(r=o()(a.a.mark((function t(){var e,n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e="".concat(d,"/coins/markets"),n="?vs_currency=".concat(this.currency,"&order=market_cap_desc&per_page=").concat(this.perPage,"&page=").concat(this.page,"&price_change_percentage=24h,7d,1y&sparkline=").concat(this.graph),t.next=4,this.fetchData(e+n);case 4:return t.abrupt("return",t.sent);case 5:case"end":return t.stop()}}),t,this)}))),function(){return r.apply(this,arguments)})},{key:"getGlobalData",value:(n=o()(a.a.mark((function t(){var e;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e="".concat(d,"/global"),t.next=3,this.fetchData(e);case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}}),t,this)}))),function(){return n.apply(this,arguments)})},{key:"fetchData",value:(e=o()(a.a.mark((function t(e){var n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.showPreloader(!0),t.prev=1,t.next=4,fetch(e);case 4:if((n=t.sent).ok){t.next=8;break}throw this.showPreloader(!1),new Error("Server Error");case 8:return this.showPreloader(!1),t.next=11,n.json();case 11:return t.abrupt("return",t.sent);case 14:t.prev=14,t.t0=t.catch(1),this.showPreloader(!1),console.log("Request error: ",t.t0.message);case 18:case"end":return t.stop()}}),t,this,[[1,14]])}))),function(t){return e.apply(this,arguments)})}]),t}();document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll(".js-market").forEach((function(t){new p(t)}))}))}]);