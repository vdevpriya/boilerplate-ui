const path = require('path'),
    hPack = require('happypack'),
    webpack = require('webpack'),
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
                    /node_modules\/(?![arc\-charts])/
                ],
                include: [
                    path.resolve(__dirname, 'src/client/js/'),
                    path.join(__dirname, 'node_modules', 'arc-charts')
                ],
                enforce: 'post',
                enforce: 'pre',
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [ 'react','env','stage-0' ],
                            plugins: ['transform-object-rest-spread', 'transform-class-properties']
                        }
                    },
                    {
                        loader: 'eslint-loader'
                    }
                ],
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                include: [
                    path.join(__dirname, 'node_modules', 'alta-react-components/dist/images')
                ],
                use: [
                    {
                        loader: 'url-loader?name=alta-react-components/dist/images/[name].[ext',
                        options: {
                            outputPath: '/img/',
                            name: '[name].[ext]'
                        },
                    },
                ],
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
        ]
    },
    devtool: 'source-map',
    plugins: [
        // new hPack({
        //     loaders: ['babel-loader'],
        //     threads: 4
        // }),
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
        })
    ]
}