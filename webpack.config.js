const fs = require('fs');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const marked = require("marked");
const renderer = new marked.Renderer();

const PATHS = {
    entry: {
        main: './src/index.js',
        scripts: './src/pages/**/*.js',
        pages: './src/pages/**/*.pug'
    },
    output: {
        css: 'css/',
        js: 'js/',
        images: 'images/',
        dist: path.join(__dirname, './dist')
    }
};

/**
 * Filter and define files
 * @param {string} entry - Entry files
 * @return [{ [key: string]: string} ] An array with list entries [ {index: 'src/index.js'} ]
 */
const getFiles = (entry) => {
    const ext = entry.split('.').pop(); // get file extension
    const re = new RegExp(`/_.*\.${ ext }`); // get files with _ (e.g. - _file-with-underscore.js)

    return glob.sync(entry).filter(file => !re.test(file)).map(file => {
        const fileName = path.basename(file, path.extname(file));

        return {[fileName]: file};
    });
};

const getNestedDir = (src, dir) => {
    const srcArr = src.replace(/\/index.pug/, '').split('/');
    let srcStr;

    if (srcArr[srcArr.length - 2] === dir) {
        srcStr = srcArr[srcArr.length - 1];
    } else if (srcArr[srcArr.length - 3] === dir) {
        srcStr = [srcArr[srcArr.length - 2], srcArr[srcArr.length - 1]].join('/');
    } else {
        srcStr = [srcArr[srcArr.length - 3], srcArr[srcArr.length - 2], srcArr[srcArr.length - 1]].join('/');
    }

    const srcWExt = srcStr.split('.');

    return srcWExt.splice(srcWExt.length - 2, 1).join();
};

const generatePages = (mode) => {
    return getFiles(PATHS.entry.pages).map(page => {

        return new HtmlWebpackPlugin({
            filename: mode === 'development'
                      ? `${ getNestedDir(Object.values(page)[0], 'pages') }.html`
                      : `../${ getNestedDir(Object.values(page)[0], 'pages') }.html`,
            template: Object.values(page)[0],
            inject: false,
            minify: {
                collapseWhitespace: true,
                preserveLineBreaks: true,
                removeComments: mode !== 'development'
            },
            isDevelopment: mode === 'development'
        });
    });
};

module.exports = (env, argv) => {
    const defaultConfig = {
        mode: argv.mode,
        entry: {
            main: './src/index.js',
            market: './src/components/market/market.js',
            coin: './src/components/coin/coin.js',
            converter: './src/components/converter/converter.js'
        },
        output: {
            filename: argv.mode !== 'production' ? 'dist/js/[name].js' : 'js/[name].js',
            // filename: 'js/main.js',
            // publicPath: './', // <script src="[publicPath]/[filename]"></script>
            path: PATHS.output.dist
        },
        resolve: {
            modules: [
                'node_modules'
            ],
            extensions: ['.js']
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                },
                {
                    test: /\.md$/,
                    use: [
                        {
                            loader: "html-loader"
                        },
                        {
                            loader: "markdown-loader",
                            options: {
                                renderer,
                                headerIds: false
                            }
                        }
                    ]
                },
                {
                    test: /\.pug$/,
                    loader: 'pug-loader'
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: argv.mode !== 'production'
                                ? 'style-loader'
                                : MiniCssExtractPlugin.loader
                        },
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('postcss-import')(),
                                    require('cssnano'),
                                    require('autoprefixer')()
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        stats: {
            all: false,
            builtAt: true,
            timings: true,
            version: true,
            modules: false,
            assets: false,
            errors: true,
            warnings: true,
            moduleTrace: true,
            errorDetails: true
        }
    };

    const defaultPlugins = [
        ...generatePages(argv.mode),
        new webpack.DefinePlugin({
            PROJECT_NAME: JSON.stringify(require('./package.json').config.projectName),
            PROJECT_URL: JSON.stringify(require('./package.json').homepage)
        }),
        new MiniCssExtractPlugin({
            filename: argv.mode !== 'production' ? 'dist/css/main.css' : 'css/main.css',
            chunkFilename: '[id].css'
        }),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {from: './src/static', to: PATHS.output.dist}
        //     ]
        // }),
    ];

    const devConfig = {
        devServer: {
            // contentBase: path.join(__dirname, './dist'),
            // compress: true,
            hot: true,
            port: 3000,
            host: '0.0.0.0',
            historyApiFallback: {
                rewrites: [
                    { from: /^\/$/, to: '/index.html' },
                    { from: /^\/index/, to: '/index.html' },
                    { from: /^\/blog/, to: '/blog.html' },
                    { from: /^\/market/, to: '/market.html' },
                    { from: /^\/coin/, to: '/coin.html' },
                    { from: /^\/converter/, to: '/converter.html' },
                    { from: /^\/portfolio/, to: '/portfolio.html' },
                    { from: /^\/about/, to: '/about.html' },
                    { from: /^\/ru\/$/, to: '/ru/index.html' },
                    { from: /^\/ru\/index/, to: '/ru/index.html' },
                    { from: /^\/ru\/blog/, to: '/ru/blog.html' },
                    { from: /^\/ru\/market/, to: '/ru/market.html' },
                    { from: /^\/ru\/coin/, to: '/ru/coin.html' },
                    { from: /^\/ru\/converter/, to: '/ru/converter.html' },
                    { from: /^\/ru\/portfolio/, to: '/ru/portfolio.html' },
                    { from: /^\/ru\/about/, to: '/ru/about.html' },
                    { from: /^\/search/, to: '/search.html' },
                    { from: /./, to: '/404.html' }
                ]
            }
            // public: '192.168.31.49:3000',
            // proxy: {
            //     '/api': 'http://localhost:8080'
            // },
        },
        devtool: 'cheap-module-eval-source-map',
        plugins: [
            ...defaultPlugins,
            new webpack.HotModuleReplacementPlugin()
        ]
    };

    const prodConfig = {
        plugins: [
            new CleanWebpackPlugin({
                // dry: true,
                // cleanOnceBeforeBuildPatterns: ['**/*', '../*.html'],
                // dangerouslyAllowCleanPatternsOutsideProject: true
            }),
            ...defaultPlugins,
            new webpack.ContextReplacementPlugin(
                /moment[/\\]locale$/,
                /ru/
            ),
            new SitemapPlugin(require('./package.json').homepage,
                getFiles(PATHS.entry.pages)
                    .filter(item => Object.keys(item)[0] !== '404')
                    .map(page => {
                        return getNestedDir(Object.values(page)[0], 'pages');
                    }), {
                    filename: '../sitemap.xml',
                    skipgzip: true,
                    lastmod: true,
                    changefreq: 'monthly',
                    priority: '0.8'
                }
            ),
            // new BundleAnalyzerPlugin()
        ]
    };

    return argv.mode !== 'production'
           ? {...defaultConfig, ...devConfig}
           : {...defaultConfig, ...prodConfig};
};
