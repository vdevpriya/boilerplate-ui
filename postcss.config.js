// module.exports = (ctx) => ({
//     map: ctx.options.map,
//     parser: ctx.options.parser,
//     plugins: {
//         'autoprefixer': { root: ctx.file.dirname },
//         'cssnano': ctx.env === 'production' ? {} : false
//     }
// })

module.exports = {
  plugins: [
    require('autoprefixer')(),
    require('cssnano')({
        zindex: false
    })
  ]
}