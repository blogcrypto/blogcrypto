import { decimalFormat } from '../../js/utils';

const e = React.createElement;

export const Chart = ({data, isFiat, currency, brush}) => {

    return e(
        Recharts.ResponsiveContainer,
        {width: '100%', height: 300},
        e(
            Recharts.AreaChart,
            {data: data, margin: {right: brush ? 80 : 30, left: brush ? 30 : 0}},
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
                    stroke: '#aaa',
                    minTickGap: 50
                }
            ),
            e(
                Recharts.YAxis,
                {
                    padding: {top: 30},
                    stroke: '#aaa',
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
                    dataKey: 'price',
                    stroke: '#0d6efd',
                    strokeWidth: 3,
                    activeDot: {'r': 6}
                }
            ),
            brush &&
            e(
                Recharts.Brush, {
                    dataKey: 'name',
                    tickFormatter: (value, name, props) => {
                        const valArr = value.split(' ');

                        return `${valArr[0]} ${valArr[2]}`;
                    },
                    fontSize: '10px',
                    style: {
                        fontSize: '10px',
                        padding: 50
                    },
                    fill: '#b1d0ff',
                    stroke: '#0d6efd'
                }
            )
        )
    );
};
