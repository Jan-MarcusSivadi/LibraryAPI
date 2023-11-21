import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.js'

import BooksView from './views/BooksView.js'
// import PlayersView from './views/PlayersView.js'

const routes = [
    { path: "/books", component: BooksView },
    // { path: "/users", component: UsersView }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

const app = createApp(App)

app.use(router)

app.config.globalProperties.API_URL = 'http://localhost:3000'
app.mount('#app')