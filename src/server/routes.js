 import * as handlers from './handlers'
 import * as api from './api/api'

const routes = [
        // home
        {
            method: 'GET',
            path: '/',
            handler: handlers.redirect
        },
        
        {
            method: 'GET',
            path: '/signin/',
            handler: handlers.indexHandler
        },

        //static js
        {
            method: 'GET',
            path: '/js/{param*}',
            config: {
                auth: false,
                handler: {
                    directory: {
                        path: 'dist/js',
                        listing: false,
                        index: false,
                        lookupCompressed: true
                    }
                }
            }
        },

        //static css
        {
            method: 'GET',
            path: '/css/{param*}',
            config: {
                auth: false,
                handler: {
                    directory: {
                        path: 'dist/css',
                        listing: false,
                        index: false
                    }
                }
            }
        },

        //static fonts
        {
            method: 'GET',
            path: '/fonts/{fontName*}',
            config: {
                auth: false,
                handler: handlers.fontHandler
            }
        },

        // img
        {
            method: 'GET',
            path: '/img/{param*}',
            config: {
                auth: false,
                handler: {
                    directory: {
                        path: 'dist/img',
                        listing: false,
                        index: false
                    }
                }
            }
        },

        //catchall
        {
            method: '*',
            path: '/{p*}',
            handler: handlers.redirect
        }
    ]

export default routes
