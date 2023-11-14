import { createApp } from 'vue'
import ChildComp from './ChildComp.js'
import vue from './components/App.js'
const vue = createApp(App)
createApp({
    components: {
        ChildComp
    },
    data() {
      return{
        bookInModal: {id: null, title: null, author: null, price: null},
        books: [],
        childMsg: 'No child msg yet'
    }
  },
  async created() {
    this.books = await (await fetch("http://localhost:3000/books")).json()
    console.log(this.books)
  },
  methods: {
    getBook: async function (id) {
      this.bookInModal = await (await fetch("http://localhost:3000/books/"+id)).json()
      let bookInfoModal = new bootstrap.Modal(document.getElementById("bookInfoModal"))
      bookInfoModal.show()
    }
  }
}).mount('#app')