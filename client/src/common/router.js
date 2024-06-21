import { createRouter, createWebHashHistory } from 'vue-router'
import { ref, reactive, inject } from 'vue'
import { AdminStore } from '../stores/AdminStore'


let routes = [
    { path: "/test", component: () => import("../views/Test.vue") },
    { path: "/", component: () => import("../views/HomePage.vue") },
    { path: "/detail", component: () => import("../views/Detail.vue") },
    { path: "/login", component: () => import("../views/Login.vue") },
    {
        path: "/dashboard", component: () => import("../views/dashboard/Dashboard.vue"), children: [
            { path: "/dashboard/category", component: () => import("../views/dashboard/Category.vue") },
            { path: "/dashboard/article", component: () => import("../views/dashboard/Article.vue") }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from) => {
    const adminStore = AdminStore()
    const message = inject("message")
    if (to.path === '/test') {
        return true
    }
    if (to.path !== '/login' && !adminStore.token) {
        message.error("请先登陆")
        return '/login'
    }
    if (to.path === '/login' && adminStore.token) {
        message.info("您已登陆")
        return false
    }
})

export { router, routes }