/* eslint-disable */

'use strict'

// const App = require ( '../../node_modules/node-app-couchdb-client/index' )
const App = require ( 'node-app-socket.io-client/index' )

import * as Debug from "debug"
const debug = Debug("libs:input:io")

// debug_internals = Debug("mngr-ui:libs:input:io:Internals"),
// debug_events = Debug("mngr-ui:libs:input:io:Events");

// import store from 'src/store'

// import DefaultConn from '@etc/default.io'
import IO from '@etc/checks.io'

export default new Class({
  Extends: App,

  // types: ['count', 'checks', 'paths'],
  // recived: [],

  options: {
    // path: '/checks',

    scheme: undefined,
    log: undefined,
    port: undefined,


  	requests : {
      once: [],
      // once: [{
      //   // init: function (req, next, app) {
      //   //   debug('once init', app.options.queries.once)
      //   //   if(app.options.queries, app.options.queries.once)
      //   //     Array.each(app.options.queries.once, function(query, index){
      //   //       debug('once init query', query, app.io.emit)
      //   //
      //   //       setTimeout(app.io.emit('/', Object.clone(query)), 1000);
      //   //       // app.io.emit('/', query)
      //   //     })
      //   // }
			// }],
			periodical: [

			],

		},

    io: {
			middlewares: [], //namespace.use(fn)
			// rooms: ['checks'], //atomatically join connected sockets to this rooms
			routes: {
				// 'app.doc': [{
				// 	// path: ':param',
				// 	// once: true, //socket.once
				// 	callbacks: ['app_doc'],
				// 	// middlewares: [], //socket.use(fn)
				// }],
        'all': [{
					// path: ':param',
					// once: true, //socket.once
					callbacks: ['checks'],
					// middlewares: [], //socket.use(fn)
				}],
        // 'on': [{
				// 	// path: ':param',
				// 	// once: true, //socket.once
				// 	callbacks: ['register'],
				// 	// middlewares: [], //socket.use(fn)
				// }],
				// '*': [{// catch all
				// 	path: '',
				// 	callbacks: ['not_found_message'],
				// 	middlewares: [], //socket.use(fn)
				// }]
			}
		}


  },
  // register: function(socket, next, result){
  //   debug('register %o', result)
  //
  // },
  checks: function(socket, next, doc){
    // let {type} = doc
    debug('checks %o', doc)

    if(doc.status){
      debug('ERROR checks %o', doc)
    }
    else if (doc.metadata && Array.isArray(doc.metadata.from)) {

    }
    // else if(
    //   doc.data
    //   && (!doc.metadata.opts || !doc.metadata.opts.params || Object.getLength(doc.metadata.opts.params) === 0)){
    //   debug('checks %o', doc)
    //   // Array.each(doc.checks.tags, function(tag){
    //   //   debug('TAG %s', tag)
    //   //   // this.io.emit('/tags/'+tag)
    //   //   this.io.emit('/', {
    //   //     params: { prop: 'tags' },
    //   //     range: "posix 1557135759000-1557136059000/*",
    //   //     body: {
    //   //       // "transformation" : "limit:30000",
    //   //       "params":{
    //   //     		"value": tag
    //   //     	}
    //   //     }
    //   //   })
    //   //
    //   // }.bind(this))
    //   //
    //   // Array.each(doc.checks.hosts, function(host){
    //   //   debug('HOST %s', host)
    //   //   // this.io.emit('/tags/'+tag)
    //   //   this.io.emit('/', {
    //   //     params: { prop: 'hosts' },
    //   //     range: "posix 1557135759000-1557136059000/*",
    //   //     body: {
    //   //       // "transformation" : "limit:30000",
    //   //     	"params":{
    //   //     		"value": host
    //   //     	}
    //   //     }
    //   //   })
    //   //
    //   // }.bind(this))
    // }
    // else{
    //   debug('OTHERS checks %o', doc)
    // }

    this.fireEvent('onDoc', [doc, { input_type: this, app: null }])

    // store.commit('checks/clear')
    // store.commit('checks/set', doc[type])
  },
  // app_doc: function(socket, next){
  //   if(this.recived.length < this.types.length){
  //     let docs = arguments[2]
  //     console.log('app_doc...', docs)
  //     if(docs && docs.type){
  //       docs = [docs]
  //       // store.commit('app/doc', doc)
  //     }
  //     Array.each(docs, function(doc){
  //       if(doc && doc.type){
  //         this.fireEvent('onPeriodicalDoc', [doc, {type: 'periodical', input_type: this, app: null}]);
  //         if(this.types.contains(doc.type) && !this.recived.contains(doc.type))
  //           this.recived.push(doc.type)
  //
  //         store.commit('app/doc', doc)
  //       }
  //     }.bind(this))
  //   }
  //
  //
  //   // if(this.recived.length == this.types.length)
  //   //   this.io.close()
  //
	// 	// arguments[1]()
	// 	// this.io.to('checks').emit('response', 'a new user has joined the room saying '+arguments[2]);
	// 	// next(socket)
	// },

  initialize: function(options){
    debug('initialize', options)

		this.parent(options);//override default options

    // let _io = new App(DefaultConn)
    this.add_io(IO)

		this.profile('checks_init');//start profiling


    this.addEvent('onConnect', function(){
      debug('initialize socket.onConnect', this.options.requests)

      // setTimeout(this.fireEvent.bind(this), 1000, 'onResume');
      // // // this.fireEvent('onOnce')
      // setTimeout(this.fireEvent.bind(this), 1000, 'onOnce');
      //
      // setTimeout(function(){
      //   if(this.options.queries, this.options.queries.once)
      //     Array.each(this.options.queries.once, function(query, index){
      //       debug('once init query', query)
      //
      //       // setTimeout(this.io.emit('/', Object.clone(query)), 1000);
      //       if(index === 0)
      //       this.io.emit('/', query)
      //     }.bind(this))
      //
      // }.bind(this), 1000)

      // this.io.emit('on', 'checks')
      // this.io.emit('on', 'changes', {
      //   params: { prop: undefined },
      //   // query: {
      //   //   "register": "changes",
      //   // },
      //   // body: {
      //   // 	"q": [
      //   // 		{"data": ["body_bytes_sent", "remote_addr", {"user_agent": {"os": ["family"]}}]},
      //   // 		{"metadata": ["host"]}
      //   // 	]
      //   //
      //   // }
      //   // body: {
      //   // 	"aggregation": "count"
      //   // }
      // })

      // this.io.emit('on', 'periodical', {
      //   params: { prop: undefined },
      //   // query: {
      //   //   // "register": "changes",
      //   //   "interval": 10000,
      //   // },
      //   // body: {
      //   // 	"q": [
      //   // 		{"data": ["body_bytes_sent", "remote_addr", {"user_agent": {"os": ["family"]}}]},
      //   // 		{"metadata": ["host"]}
      //   // 	]
      //   //
      //   // }
      //
      //   body: {
      //     "interval": 10000,
      //     // "q": [
      //   	// 	{"metadata": ["path"]}
      //   	// ],
      //   	"aggregation": "count"
      //   }
      // })

      // this.io.emit('on', 'periodical', {
      //   params: { prop: undefined },
      //
      //   body: {
      //     // "interval": 5000,
      //   	"aggregation": "count"
      //   }
      // })
      //
      // this.io.emit('on', 'periodical', {
      //   params: { prop: undefined },
      //
      //   body: {
      //     // "interval": 5000,
      //   	"q": [
      //   		{"data": ["status"]},
      //   	],
      //   	"filter": "('data')('status').eq(200)",
      //     "aggregation": "count"
      //   }
      // })

      // this.io.emit('on', 'periodical', {
      //   // range: "posix 1557135759000-1557136059000/*",
      //   body: {
      //     "transformation" : "limit:30000"
      //   //   "interval": 5000,
      //   }
      // })

      // this.io.emit('/', {
      //   query: {register: 'periodical'},
      //   body: {
      //     "transformation" : "limit:30000"
      //
      //   }
      // })

      /**
      * test queries
      **/

      // this.io.emit('/', {
      //   body: {
      //     // register: 'periodical',
      //     'q': [
      //       { 'data': ['log'] },
      //       { 'metadata': ['host', 'tag', 'timestamp'] }
      //     ],
      //     'transformation': [
      //       { 'orderBy': { 'index': 'r.desc(timestamp)' } },
      //       'slice:0:9'
      //     ]
      //   }
      // })
      // this.io.emit('/', {
      //   body: {
      //     // register: 'periodical',
      //     'q': [
      //       { 'data': ['log'] },
      //       { 'metadata': ['host', 'tag', 'timestamp'] }
      //     ],
      //     'transformation': 'slice:0:9'
      //   }
      // })

      // this.io.emit('/', {
      //   query: {
      //     register: 'changes',
      //     'q': [
      //       { 'data': ['log'] },
      //       { 'metadata': ['host', 'tag', 'timestamp'] }
      //     ]
      //     // 'transformation': [
      //     //   { 'orderBy': { 'index': 'r.desc(timestamp)' } },
      //     //   'slice:0:9'
      //     // ]
      //   }
      //
      // })
      //
      //

      // this.io.emit('/')

      // this.io.emit('/', { query: {}})

      /**
      * test queries
      **/



    }.bind(this))

    this.addEvent('onExit', function(){
      debug('onExit')

      // this.io.on('off', 'all')
      this.io.emit('off')

      this.remove_io_routes()

      // if(this.io.disconnected == false)
        // this.io.close()
    }.bind(this))

		this.profile('checks_init');//end profiling

		this.log('checks', 'info', 'checks started');
  },

});
