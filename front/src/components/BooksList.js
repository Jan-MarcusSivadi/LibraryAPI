export default {
    /*html*/
    template: `
    <table id="booksTable" class="table table-striped table-bordered">
      <tr> 
        <th>Title</th>
        <th>Author</th>
        <th>Price</th>
      </tr>
      <tr v-for="book in books">
         <td @click="getBook(book.id)">{{ book.title}}</td>
         <td>{{ book.author}}</td>
         <td>{{ book.price}}</td>
      </tr>
    </table>
    `,
    emits: {
        showModal: (book) => {
            console.log("Validation", book)
            return book.id && book.title && book.author && book.price
        }
    },
    data() {
        return {
            books: []
        }
    },
    async created() {
        this.books = await (await fetch("http://localhost:8080/books")).json()
    },
    methods: {
        getBook: async function (id) {
            const bookInModal = await (await fetch("http://localhost:8080/books/" + id)).json()
            console.log("BooksList: ", bookInModal)
            this.$emit("showModal", bookInModal)
        }
    }
}