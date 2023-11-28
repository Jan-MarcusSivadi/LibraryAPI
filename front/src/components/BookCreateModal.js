export default {
    /*html*/
    template: `
        <!-- Book Info Modal -->
<div id="bookCreateModal" class="modal" tabindex="-1">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">New Book</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form>
            <div class="modal-body">
                <div styel="display:flex; width: 100%;">
                    <label for="title">Title<input v-model="modifiedBook.title" id="title" name="title" value="" type="text" placeholder="Title" /></label>
                </div>
                <div styel="display:flex; width: 100%;">
                <label for="description">Description<input v-model="modifiedBook.description" id="description" name="description" value="" type="text" placeholder="Description" /></label>
                </div>
                <div styel="display:flex; width: 100%;">
                    <label for="author">Author<input v-model="modifiedBook.author" id="author" name="author" value="" type="text" placeholder="Author" /></label>
                </div>
                <div styel="display:flex; width: 100%;">
                    <label for="language">Language<input v-model="modifiedBook.language" id="language" name="language" value="" type="text" placeholder="English" /></label>
                </div>
                <div styel="display:flex; width: 100%;">
                    <label for="booklength">Book Length<input v-model="modifiedBook.booklength" id="booklength" name="booklength" value="" type="number" placeholder="255" /></label>
                </div>
                <div styel="display:flex; width: 100%;">
                    <label for="releasedate">Release Date<input v-model="modifiedBook.releasedate" id="releasedate" name="releasedate" value="" type="date" placeholder="Release Date" /></label>
                </div>
                <div styel="display:flex; width: 100%;">
                    <label for="price">Price<input v-model="modifiedBook.price" id="price" name="price" value="" type="number" placeholder="$0" /></label>
                </div>
            </div>
            <div class="modal-footer">
                <div class="row">
                    <div class="col auto">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success" @click="saveCreatedBook">Create</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
</div>
    `,
    emits: ["bookCreated"],
    data() {
        return {
            modifiedBook: {}
        }
    },
    methods: {
        async saveCreatedBook() {
            // client form validation
            const { title, description, author, releasedate, language, booklength, price } = this.modifiedBook
            console.log("data", {title, description, author, language, booklength, price})

            if (!title) {
                return alert("Title field is required")
            }
            if (!author) {
                return alert("Author field is required")
            }
            if (!booklength) {
                return alert("Book Length field is required")
            }
            if (!releasedate) {
                return alert("Release Date field is required")
            }
            if (!price) {
                return alert("Price field is required")
            }

            const rawResponse = await fetch(this.API_URL + "/books", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.modifiedBook)
            });
            console.log(rawResponse);
            this.$emit("bookCreated")
        },
    }
}