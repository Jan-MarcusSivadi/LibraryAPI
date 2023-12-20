// import FormData from 'form-data'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.js'

import BooksView from './views/BooksView.js'
import UsersView from './views/UsersView.js'
import OrdersView from './views/OrdersView.js'
import HomeView from './views/HomeView.js'

const routes = [
    { path: "/", component: HomeView },
    { path: "/books", component: BooksView },
    { path: "/users", component: UsersView },
    { path: "/orders", component: OrdersView }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

const app = createApp(App)

app.use(router)

// app.config.globalProperties.FORM_DATA = FormData
app.config.globalProperties.API_URL = 'http://localhost:3000'
app.mount('#app')