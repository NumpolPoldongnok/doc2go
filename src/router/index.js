import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Consultation from '@/views/Consultation.vue'
import Verify from '@/views/Verify.vue'
import Reports from '@/views/Reports.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home - Doctor2GO' }
  },
  {
    path: '/consultation',
    name: 'Consultation',
    component: Consultation,
    meta: { title: 'New Consultation - Doctor2GO' }
  },
  {
    path: '/verify',
    name: 'Verify',
    component: Verify,
    meta: { title: 'Verify Documents - Doctor2GO' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { title: 'Reports - Doctor2GO' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Doctor2GO'
  next()
})

export default router