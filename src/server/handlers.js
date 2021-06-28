/*
  These are just handling functions for our server.
*/

import path from 'path'

export function redirect (req, reply) {
  // var token;
  // if (request.query[config.ssoTokenQueryParamKey]) {
  //     token = request.query[config.ssoTokenQueryParamKey]
  // } else if (request.state[config.cookieSSOTokenKey]) {
  //     // SSO token value in the cookie is URI-encoded for some reason
  //     token = decodeURIComponent(request.state[config.cookieSSOTokenKey])
  // }
    // console.log("token");
    reply().redirect('/signin/')
}

export function indexHandler (req, reply) {
  // console.log(req);
    reply.view('index', {'title': 'view'})
}

export function errorHandler (err) {
    err && console.error('Failed to load', err)
}

export function fontHandler (req, reply) {
    reply.file(path.join(process.cwd(), '/dist/fonts/' + req.params.fontName)).type(req.params.fontName.split('.')[1])
}
