import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '*',
      component: () => import(/* webpackChunkName: "PageNotFound" */ '@/modules/404Page.vue')
    },
    
    {
      path: '/',
      name: 'Home',
      redirect: '/RateBooking',
    },
    {
      path: '/RateBooking',
      name: 'RateBooking',
      component: () => import(/* webpackChunkName: "RateBooking" */ '@/modules/RateBooking/RateBooking.vue'),
    },
    {
      path: '/SavedDeals',
      name: 'SavedDeals',
      component: () => import(/* webpackChunkName: "SavedDeals" */ '@/modules/SavedDeals/SavedDeals.vue'),
    },
    {
      path: '/DealBooking',
      name: 'DealBooking',
      component: () => import(/* webpackChunkName: "DealBooking" */ '@/modules/DealBooking/DealBooking.vue'),
    },
    {
      path: '/BookedDeals',
      name: 'BookedDeals',
      component: () => import(/* webpackChunkName: "BookedDeals" */ '@/modules/BookedDeals/BookedDeals.vue'),
    },
    {
      path: '/CloseDeal',
      name: 'CloseDeal',
      component: () => import(/* webpackChunkName: "CloseDeal" */ '@/modules/CloseDeal/CloseDeal.vue'),
    },
    {
      path: '/DealHistory',
      name: 'DealHistory',
      component: () => import(/* webpackChunkName: "DealHistory" */ '@/modules/DealHistory/DealHistory.vue'),
    }
  ]
})


