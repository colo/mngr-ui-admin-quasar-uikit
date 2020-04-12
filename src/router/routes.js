
const routes = [
  {
    path: '/',
    // component: () => import('@apps/root/index.vue'),
    component: () => import('layouts/App'),
    meta: {
      breadcrumb: { label: 'Index', icon: 'widgets', app: 'root' }
    },
    children: [
      {
        path: '',
        component: () => import('@apps/root/index.vue')
      },
      {
        path: '/vhosts',
        name: 'vhosts',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "vhosts" */ '@apps/vhosts/index.vue'),
        meta: {
          breadcrumb: { label: 'Vhosts', icon: 'widgets', app: 'vhosts' }
        }

        // children: [
        //   {
        //     path: ':host',
        //     name: 'Host',
        //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
        //     meta: {
        //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
        //     }
        //   }
        //   // {
        //   //   path: 'profile',
        //   //   component: () => import('pages/user-profile')
        //   // }
        // ]
      },
      {
        path: '/checks',
        name: 'checks',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "checks" */ '@apps/checks/index.vue'),
        meta: {
          breadcrumb: { label: 'Checks', icon: 'widgets', app: 'checks' }
        }

        // children: [
        //   {
        //     path: ':host',
        //     name: 'Host',
        //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
        //     meta: {
        //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
        //     }
        //   }
        //   // {
        //   //   path: 'profile',
        //   //   component: () => import('pages/user-profile')
        //   // }
        // ]
      },
      {
        path: '/alerts',
        name: 'alerts',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "alerts" */ '@apps/alerts/index.vue'),
        meta: {
          breadcrumb: { label: 'Alerts', icon: 'widgets', app: 'alerts' }
        }

        // children: [
        //   {
        //     path: ':host',
        //     name: 'Host',
        //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
        //     meta: {
        //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
        //     }
        //   }
        //   // {
        //   //   path: 'profile',
        //   //   component: () => import('pages/user-profile')
        //   // }
        // ]
      },
      {
        path: 'munin',
        name: 'munin',
        redirect: { name: 'munin_hosts' },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "munin" */ '@apps/munin/index.vue'),
        meta: {
          breadcrumb: { label: 'Munin', icon: 'widgets', app: 'munin' }
        },

        children: [
          {
            path: 'hosts',
            name: 'munin_hosts',
            component: () => import(/* webpackChunkName: "munin.hosts" */ '@apps/munin/pages/hosts.vue'),
            meta: {
              breadcrumb: { label: 'Munin Hosts', icon: 'widgets', app: 'munin' }
            },
            children: [
              {
                path: ':host',
                name: 'munin_host',
                component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/pages/host.vue'),
                meta: {
                  breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
                }
              }
            ]
          },
          {
            path: 'categories',
            name: 'munin_categories',
            component: () => import(/* webpackChunkName: "munin.categories" */ '@apps/munin/pages/categories.vue'),
            meta: {
              breadcrumb: { label: 'Munin Categories', icon: 'widgets', app: 'munin' }
            },
            children: [
              {
                path: ':category',
                name: 'munin_category',
                component: () => import(/* webpackChunkName: "munin.category" */ '@apps/munin/pages/category.vue'),
                meta: {
                  breadcrumb: { label: 'Munin Category', icon: 'widgets', app: 'munin' }
                }
              }
            ]
          }

        ]
      },
      {
        path: 'os',
        name: 'os',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "os" */ '@apps/os/index.vue'),
        redirect: { name: 'os_hosts' },
        meta: {
          breadcrumb: { label: 'OS', icon: 'widgets', app: 'os' }
        },

        children: [
          {
            path: 'hosts',
            name: 'os_hosts',
            component: () => import(/* webpackChunkName: "os.hosts" */ '@apps/os/pages/hosts.vue'),
            meta: {
              breadcrumb: { label: 'OS Hosts', icon: 'widgets', app: 'os' }
            },
            children: [
              {
                path: ':host',
                name: 'os_host',
                component: () => import(/* webpackChunkName: "os.host" */ '@apps/os/pages/host.vue'),
                meta: {
                  breadcrumb: { label: 'OS Host', icon: 'widgets', app: 'os' }
                }
              }
            ]
          },
          {
            path: 'categories',
            name: 'os_categories',
            component: () => import(/* webpackChunkName: "os.hosts" */ '@apps/os/pages/categories.vue'),
            meta: {
              breadcrumb: { label: 'OS Categories', icon: 'widgets', app: 'os' }
            },
            children: [
              {
                path: ':category',
                name: 'os_category',
                component: () => import(/* webpackChunkName: "os.category" */ '@apps/os/pages/category.vue'),
                meta: {
                  breadcrumb: { label: 'OS Category', icon: 'widgets', app: 'os' }
                }
              }
            ]
          }

        ]
      },
      {
        path: 'logs',
        name: 'logs',
        redirect: { name: 'logs_all' },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "logs" */ '@apps/logs/index.vue'),
        meta: {
          breadcrumb: { label: 'Logs', icon: 'widgets', app: 'logs' }
        },

        children: [
          {
            path: '',
            name: 'logs_all',
            // redirect: { name: 'logs_all' },
            component: () => import(/* webpackChunkName: "logs.webs" */ '@apps/logs/pages/all.vue'),
            meta: {
              breadcrumb: { label: 'Logs All', icon: 'widgets', app: 'logs' }
            }
            // children: [
            //   {
            //     path: '',
            //     name: 'logs_webs_all',
            //     component: () => import(/* webpackChunkName: "logs.webs.all" */ '@apps/logs/pages/webs/all.vue'),
            //     meta: {
            //       breadcrumb: { label: 'Logs Webs All', icon: 'widgets', app: 'logs' }
            //     }
            //   },
            //   {
            //     path: 'filter',
            //     name: 'logs_webs_filter',
            //     component: () => import(/* webpackChunkName: "logs.webs.filter" */ '@apps/logs/pages/webs/filter.vue'),
            //     meta: {
            //       breadcrumb: { label: 'Logs Webs Filter', icon: 'widgets', app: 'logs' }
            //     }
            //   }
            // ]
          },
          {
            path: 'educativa',
            name: 'logs_educativa',
            redirect: { name: 'logs_educativa_all' },
            component: () => import(/* webpackChunkName: "logs.educativa" */ '@apps/logs/index.vue'),
            meta: {
              breadcrumb: { label: 'Logs Webs', icon: 'widgets', app: 'logs' }
            },
            children: [
              {
                path: '',
                name: 'logs_educativa_all',
                component: () => import(/* webpackChunkName: "logs.educativa.all" */ '@apps/logs/educativa/pages/all.vue'),
                meta: {
                  breadcrumb: { label: 'Logs Webs All', icon: 'widgets', app: 'logs' }
                }
              },
              {
                path: 'filter',
                name: 'logs_educativa_filter',
                component: () => import(/* webpackChunkName: "logs.educativa.filter" */ '@apps/logs/educativa/pages/filter.vue'),
                meta: {
                  breadcrumb: { label: 'Logs Webs Filter', icon: 'widgets', app: 'logs' }
                }
              }
            ]
          },
          {
            path: 'webs',
            name: 'logs_webs',
            redirect: { name: 'logs_webs_all' },
            component: () => import(/* webpackChunkName: "logs.webs" */ '@apps/logs/web/index.vue'),
            meta: {
              breadcrumb: { label: 'Logs Webs', icon: 'widgets', app: 'logs' }
            },
            children: [
              {
                path: '',
                name: 'logs_webs_all',
                component: () => import(/* webpackChunkName: "logs.webs.all" */ '@apps/logs/web/pages/all.vue'),
                meta: {
                  breadcrumb: { label: 'Logs Webs All', icon: 'widgets', app: 'logs' }
                }
              },
              {
                path: 'filter',
                name: 'logs_webs_filter',
                component: () => import(/* webpackChunkName: "logs.webs.filter" */ '@apps/logs/web/pages/filter.vue'),
                meta: {
                  breadcrumb: { label: 'Logs Webs Filter', icon: 'widgets', app: 'logs' }
                }
              }
            ]
          }
          // {
          //   path: 'categories',
          //   name: 'logs_categories',
          //   component: () => import(/* webpackChunkName: "logs.categories" */ '@apps/logs/pages/categories.vue'),
          //   meta: {
          //     breadcrumb: { label: 'Logs Categories', icon: 'widgets', app: 'logs' }
          //   },
          //   children: [
          //     {
          //       path: ':category',
          //       name: 'logs_category',
          //       component: () => import(/* webpackChunkName: "logs.category" */ '@apps/logs/pages/category.vue'),
          //       meta: {
          //         breadcrumb: { label: 'Logs Category', icon: 'widgets', app: 'logs' }
          //       }
          //     }
          //   ]
          // }

        ]
      },
      // {
      //   path: '/tf',
      //   name: 'tf',
      //   // route level code-splitting
      //   // this generates a separate chunk (about.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () => import(/* webpackChunkName: "tf" */ '@apps/tf/index.vue'),
      //   meta: {
      //     breadcrumb: { label: 'TensorFlow', icon: 'widgets', app: 'tf' }
      //   }
      //
      //   // children: [
      //   //   {
      //   //     path: ':host',
      //   //     name: 'Host',
      //   //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
      //   //     meta: {
      //   //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
      //   //     }
      //   //   }
      //   //   // {
      //   //   //   path: 'profile',
      //   //   //   component: () => import('pages/user-profile')
      //   //   // }
      //   // ]
      // },
      {
        path: '/brain',
        name: 'brain',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "brain" */ '@apps/brain/index.vue'),
        meta: {
          breadcrumb: { label: 'Barin', icon: 'widgets', app: 'brain' }
        }

        // children: [
        //   {
        //     path: ':host',
        //     name: 'Host',
        //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
        //     meta: {
        //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
        //     }
        //   }
        //   // {
        //   //   path: 'profile',
        //   //   component: () => import('pages/user-profile')
        //   // }
        // ]
      },
      {
        path: '/neataptic',
        name: 'neataptic',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "neataptic" */ '@apps/neataptic/index.vue'),
        meta: {
          breadcrumb: { label: 'neataptic', icon: 'widgets', app: 'neataptic' }
        }

        // children: [
        //   {
        //     path: ':host',
        //     name: 'Host',
        //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
        //     meta: {
        //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
        //     }
        //   }
        //   // {
        //   //   path: 'profile',
        //   //   component: () => import('pages/user-profile')
        //   // }
        // ]
      },
      {
        path: '/carrot',
        name: 'carrot',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "carrot" */ '@apps/carrot/index.vue'),
        meta: {
          breadcrumb: { label: 'carrot', icon: 'widgets', app: 'carrot' }
        }

        // children: [
        //   {
        //     path: ':host',
        //     name: 'Host',
        //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
        //     meta: {
        //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
        //     }
        //   }
        //   // {
        //   //   path: 'profile',
        //   //   component: () => import('pages/user-profile')
        //   // }
        // ]
      }
    ]
  }

  // {
  //   path: '/',
  //   component: () => import('layouts/App'),
  //   meta: {
  //     breadcrumb: { label: 'Home', icon: 'home' }
  //   },
  //   children: [
  //     {
  //       path: '',
  //       // path: '',
  //       component: () => import('@apps/root/index'),
  //       meta: {
  //         breadcrumb: { label: 'Index', icon: 'widgets', app: 'root' }
  //       }
  //
  //       // children: [
  //       //   {
  //       //     path: ':table',
  //       //     name: 'Table',
  //       //     component: () => import('@apps/root/table'),
  //       //     meta: {
  //       //       breadcrumb: { label: 'Table', icon: 'widgets' }
  //       //     }
  //       //   }
  //       //   // {
  //       //   //   path: 'profile',
  //       //   //   component: () => import('pages/user-profile')
  //       //   // }
  //       // ]
  //     },
  //     {
  //       path: '/munin',
  //       // path: '',
  //       component: () => import('@apps/munin/index'),
  //       meta: {
  //         breadcrumb: { label: 'Munin', icon: 'widgets', app: 'munin' }
  //       },
  //
  //       children: [
  //         {
  //           path: ':host',
  //           name: 'Host',
  //           component: () => import('@apps/munin/components/host'),
  //           meta: {
  //             breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
  //           }
  //         }
  //         // {
  //         //   path: 'profile',
  //         //   component: () => import('pages/user-profile')
  //         // }
  //       ]
  //     },
  //
  //   ]
  //
  // }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
