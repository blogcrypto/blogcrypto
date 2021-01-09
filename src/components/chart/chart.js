import { decimalFormat } from '../../js/utils';

const e = React.createElement;

export const Chart = ({data, isFiat, currency}) => {
    // const inputs = document.querySelectorAll('.js-converter-input');

    // inputs.forEach(item => {
    //     item.addEventListener('change', e => console.log(e.target.value));
    // });

    // React.useEffect(() => {
        // console.log(prop);
    // });

    // console.log('chart data ', data);

    return e(
        Recharts.ResponsiveContainer,
        {width: '100%', height: 300},
        e(
            Recharts.AreaChart,
            {data: data, margin: {right: 30, top: 30}},
            e('defs', {},
                e('linearGradient',
                    {id: 'chartGradient', x1: '0%', y1: '100%', x2: '0%', y2: '0%'},
                    e('stop', {offset: '0%', stopColor: '#ffffff'}),
                    e('stop', {offset: '100%', stopColor: '#b1d1ff'})
                )
            ),
            e(
                Recharts.CartesianGrid,
                {strokeDasharray: '3 3', stroke: '#e8e8e8'}
            ),
            e(
                Recharts.XAxis,
                {
                    dataKey: 'name',
                    stroke: '#aaa'
                }
            ),
            e(
                Recharts.YAxis,
                {
                    stroke: '#aaa',
                    padding: {top: 30, left: 30},
                    tickFormatter: (tick => {
                        if (tick > 1000 && tick < 1000000) {
                            return `${ tick.toString().slice(0, -3) }K`;
                        } else if (tick >= 1000000) {
                            return `${ tick.toString().slice(0, -6) }M`;
                        } else {
                            return tick;
                        }
                    })
                }
            ),
            e(
                Recharts.Tooltip,
                {
                    formatter: (value, name, props) => [`${ decimalFormat(value, isFiat ? 2 : 8) } ${ currency }`, 'Price'],
                    labelFormatter: (value, name, props) => {
                        return `Date: ${ value }`;
                    },
                    label: 'test',
                    cursor: {
                        stroke: '#ccc',
                        strokeWidth: 2
                    }
                }
            ),
            e(
                Recharts.Area,
                {
                    fill: 'url(#chartGradient)',
                    // type: 'linear',
                    dataKey: 'price',
                    stroke: '#0d6efd',
                    strokeWidth: 3,
                    activeDot: {'r': 6}
                }
            )
        )
    );
};


