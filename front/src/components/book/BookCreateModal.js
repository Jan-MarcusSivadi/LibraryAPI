import FormData from 'form-data'

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
        <form class="submit-button">
            <div class="modal-body" >

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="title" class="row-sm-10 col-form-label">Title</label>
                                <div class="row-sm-auto">
                                    <input id="title" name="title" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter title" v-model="modifiedBook.title">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="description" class="row-sm-10 col-form-label">Description</label>
                                <div class="row-sm-10">
                                    <input id="description" name="description" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter description" v-model="modifiedBook.description">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="author" class="row-sm-10 col-form-label">Author</label>
                                <div class="row-sm-10">
                                    <input id="author" name="author" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter author" v-model="modifiedBook.author">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="language" class="row-sm-10 col-form-label">Language</label>
                                <div class="row-sm-10">
                                    <input id="language" name="language" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter language" v-model="modifiedBook.language">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="booklength" class="row-sm-10 col-form-label">Book Length</label>
                                <div class="row-sm-10">
                                    <input id="booklength" name="booklength" type="number" min="0" class="form-control" aria-describedby="emailHelp" placeholder="Enter booklength" v-model="modifiedBook.booklength">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="releasedate" class="row-sm-10 col-form-label">Release Date</label>
                                <div class="row-sm-10">
                                    <input id="releasedate" name="releasedate" type="date" class="form-control" aria-describedby="emailHelp" placeholder="Enter releasedate" v-model="modifiedBook.releasedate">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="price" class="row-sm-10 col-form-label">Price</label>
                                <div class="row-sm-10">
                                    <input id="price" name="price" type="number" min="0" class="form-control" aria-describedby="emailHelp" placeholder="Enter price" v-model="modifiedBook.price">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="modal-footer">
                <div class="row container-fluid">

                    <div class="col auto text-start"></div>
                    <div class="col me-auto text-end gx-2">
                        <button type="button" class="btn btn-secondary container-fluid" data-bs-dismiss="modal">Cancel</button>
                    </div>
                    <div class="col me-auto text-end gx-2">
                    <button type="button" class="btn btn-success container-fluid" @click="saveCreatedBook">Create</button>
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

            // document.querySelector('.submit-form').addEventListener('submit', (e) => {
            //     e.preventDefault()
            // })

            if (!title) {
                return alert("Title field is required")
            }
            if (!author) {
                return alert("Author field is required")
            }

            if (booklength == undefined) {
                return alert("Book Length field is required")
            }
            let num
            try {
                num = Number(booklength)
            } catch (error) {
                console.log('number convert error!')
            }
            if (isNaN(num)) {
                return alert("Book Length field must be numeric")
            }
            if (num <= 0) {
                return alert("Book Length must be greater than zero")
            }

            if (!releasedate) {
                return alert("Release Date field is required")
            }

            if (price == undefined) {
                return alert("Price field is required")
            }
            let num2
            try {
                num2 = Number(price)
            } catch (error) {
                console.log('number convert error!')
            }
            if (isNaN(num2)) {
                return alert("Price field must be numeric")
            }
            if (num2 < 0) {
                return alert("Price cannot be negative")
            }
            console.log("Creating:", this.modifiedBook)

            // const form = new FormData()
            // form.append('Files', img)

            const rawResponse = await fetch(this.API_URL + "/books", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.modifiedBook)
            });

            if (rawResponse.status !== 201) {
                return alert("Book could not be created!")
            }

            console.log(rawResponse);
            this.$emit("bookCreated")
        },
    }
}