export const decimalFormat = (number, decimals = 2, decPoint = ',', thousandsSep = ' ') => {
    let s;

    number = +String(number).replace(/[^0-9+\-Ee.]/g, '');

    s = decimals
        ? String(Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)).split('.')
        : String(Math.round(number)).split('.');

    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousandsSep);
    }

    if (!!s[1] && (s[1].length < decimals)) {
        s[1] += new Array(decimals - s[1].length + 1).join('0');
    }

    return s.join(decPoint);
}
