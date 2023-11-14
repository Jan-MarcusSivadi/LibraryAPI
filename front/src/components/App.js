import booksList from "./BooksList.js"
import bookInfoModal from "./BookInfoModal.js"
export default {
    /*html*/
    template: `
    <books-list @showModal="openModal"></books-list>
    <book-info-modal :bookInModal="bookInModal"></book-info-modal>
    `,
    components: {
        booksList,
        bookInfoModal
    },
    data() {
        return {
            msg: 'Hello world!',
            bookInModal: { id: "", title: "", author:"", price: "" }
        }
    },
    methods: {
        openModal(book) {
            this.bookInModal = book
            let bookInfoModal = new bootstrap.Modal(document.getElementById("bookInfoModal"))
            bookInfoModal.show()
        }
    }
} 