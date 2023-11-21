export default {
    /*html*/
    template: `
    <table id="booksTable" class="table table-striped table-bordered">
        <thead>
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="book in books">
                <td @click="getBook(book.id)">{{ book.title }}</td>
                <td>{{ book.author }}</td>
                <td>{{ book.price }}</td>
            </tr>
        </tbody>
    </table>
    `,
    emits: ["showModal"],
    data() {
        return {
            books: []
        }
    },
    async created() {
        this.books = await (await fetch(this.API_URL + "/books")).json()
    },
    methods: {
        getBook: async function (id) {
            const bookInModal = await (await fetch(this.API_URL + "/books/" + id)).json()
            this.$emit("showModal", bookInModal)
        }
    }
}