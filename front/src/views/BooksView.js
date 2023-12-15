import booksList from "../components/book/BooksList.js"
import bookInfoModal from "../components/book/BookInfoModal.js"
import bookCreateModal from "../components/book/BookCreateModal.js"

export default {
    /*html*/
    template: `
    <div style="display: flex; padding: 10px 20px">
        <h2>Books</h2>
        <div style="display: flex; justify-content: end; width: 100%;">
            <button style="margin: 0 15px;" type="button" class="btn btn-secondary" @click="openCreateModal">Create New</button>
        </div>
    </div>
    <books-list :key="update" @showModal="openModal"></books-list>
    <book-info-modal @bookUpdated="updateView" :staticObj="staticObj" :bookInModal="bookInModal" @bookDeleted="bookDeleted"></book-info-modal>
    <book-create-modal @bookCreated="bookCreated" :bookInModal="bookInModal" @bookDeleted="bookDeleted"></book-create-modal>
    `,
    components: {
        booksList,
        bookInfoModal,
        bookCreateModal
    },
    data() {
        return {
            update: 0,
            bookInModal: {
                id: "",
                title: "",
                author: "",
                description: "",
                releasedate: "",
                booklength: "",
                language: "",
                price: "",
                pdf: "",
            },
            staticObj: {},
            myModal: null,
            myModalCreate: null,
        }
    },
    methods: {
        openModal(book) {
            this.staticObj = { ...book }

            this.bookInModal = book
            if (this.myModal === null) {
                this.myModal = new bootstrap.Modal(document.getElementById("bookInfoModal"))
            }
            this.myModal.show()
        },
        openCreateModal() {
            if (this.myModalCreate === null) {
                this.myModalCreate = new bootstrap.Modal(document.getElementById("bookCreateModal"))
            }
            this.myModalCreate.show()
        },
        bookCreated() {
            this.myModalCreate.hide()
            this.update++
        },
        updateView(book) {
            this.update++
            this.staticObj = { ...book }

            this.bookInModal = book
        },
        bookDeleted(res) {
            console.log(res)
            if (res.status !== 204) {
                return alert("Book could not be deleted")
            }
            this.update++
        }
    }
}