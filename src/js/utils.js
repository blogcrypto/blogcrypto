export const decimalFormat = (number, decimals, decPoint = '.', thousandsSep = ' ') => {
    let s;

    number = +String(number).replace(/[^0-9+\-Ee.]/g, '');

    const isExp = String(number).split(/[eE]/);

    if (isExp.length > 1) {

        let x = number;

        if (Math.abs(x) < 1) {
            let e = parseInt(x.toString().split('e-')[1]);

            if (e) {
                x *= Math.pow(10, e - 1);
                x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
            }
        } else {
            let e = parseInt(x.toString().split('+')[1]);

            if (e > 20) {
                e -= 20;
                x /= Math.pow(10, e);
                x += (new Array(e + 1)).join('0');
            }
        }

        s = decimals
            ? [(+x).toFixed(decimals).split(',')]
            : [(+x).split(',')]

    } else {
        s = decimals
            ? String(Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)).split('.')
            : String(Math.round(number)).split('.');
    }

    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousandsSep);
    }

    if (!!s[1] && (s[1].length < decimals)) {
        s[1] += new Array(decimals - s[1].length + 1).join('0');
    }

    return s.join(decPoint);
};
