const path = require('path'),
    webpack = require('webpack'),
    hPack = require('happypack'),
    analyze = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    entry: './src/client/js/index',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'bundle.min.js'
    },
    module: {
        rules: [

            {
                test: /\.jsx?$/,
                exclude: [
                    /node_modules/
                ],
                include: [
                    path.resolve(__dirname, 'src/client/js/')
                ],
                
                enforce: 'pre',
                enforce: 'post',

                loader: 'happypack/loader',
            }

        ]
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src/client/js/')
        ],
        extensions: [
            '.js',
            '.json',
            '.jsx'
        ],
        alias: {
            'react': 'preact-compat',
            'react-dom': 'preact-compat'
        }
    },
    performance: {
        hints: 'warning'
    },
    plugins: [
        new hPack({
            loaders: [ 'babel-loader' ],
            threads: 4
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            comments: false,
            mangle: true,
            output: {
                comments: false,
            },
            compress: {
                warnings: false,
                pure_getters: true,
                screw_ie8: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            },
        }),
        new analyze()
    ]


}