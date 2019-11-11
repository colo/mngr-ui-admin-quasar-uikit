
const routes = [
  {
    path: '/',
    component: () => import('@apps/root/index.vue'),
    meta: {
      breadcrumb: { label: 'Index', icon: 'widgets', app: 'root' }
    }
  },
  {
    path: '/munin',
    name: 'munin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "munin" */ '@apps/munin/index.vue'),
    meta: {
      breadcrumb: { label: 'Munin', icon: 'widgets', app: 'munin' }
    },

    children: [
      {
        path: ':host',
        name: 'Host',
        component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
        meta: {
          breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
        }
      }
      // {
      //   path: 'profile',
      //   component: () => import('pages/user-profile')
      // }
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
