const path = require('path'),
    hPack = require('happypack'),
    uglify = require('uglifyjs-webpack-plugin'),
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
        ]
    },
    performance: {
        hints: 'warning'
    },
    plugins: [
        new hPack({
            loaders: [ 'babel-loader' ],
        }),
        new uglify({
            minimize: true,
            sourceMap: false,
            comments: false,
            compress: {
                unused: true,
                dead_code: true,
                warnings: false,
                drop_debugger: true,
                conditionals: true,
                evaluate: true,
                drop_console: true,
                sequences: true,
                booleans: true,
            }
        })
    ]

}