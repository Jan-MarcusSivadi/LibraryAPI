import confirmationModal from "../ConfirmationModal.js"
export default {
    /*html*/
    template: `
<!-- Book Info Modal -->
<div id="bookInfoModal" class="modal" tabindex="-1">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 v-if="isEditing" class="modal-title">Edit {{bookInModal.title}}</h5>
              <h5 v-else class="modal-title">{{bookInModal.title}}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

            <div v-if="isEditing">
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
          
            <table v-else class="table table-striped">
                <tr>
                    <th>Id</th>
                    <td>{{bookInModal.id}}</td>
                </tr>
                <tr>
                    <th>Title</th>
                    <td v-if="isEditing"><input v-model="modifiedBook.title"></td>
                    <td v-else>{{bookInModal.title}}</td>
                </tr>
                <tr>
                    <th>Description</th>
                    <td v-if="isEditing"><input v-model="modifiedBook.description"></td>
                    <td v-else>{{bookInModal.description}}</td>
                </tr>
                <tr>
                    <th>Author</th>
                    <td v-if="isEditing"><input v-model="modifiedBook.author"></td>
                    <td v-else>{{bookInModal.author}}</td>
                </tr>
                <tr>
                <th>Language</th>
                <td v-if="isEditing"><input v-model="modifiedBook.language"></td>
                <td v-else>{{bookInModal.language}}</td>
                </tr>
                <tr>
                <th>Book Length</th>
                <td v-if="isEditing"><input v-model="modifiedBook.booklength"></td>
                <td v-else>{{bookInModal.booklength}}</td>
                </tr>
                <tr>
                    <th>Price</th>
                    <td v-if="isEditing"><input v-model="modifiedBook.price"></td>
                    <td v-else>{{bookInModal.price}}</td>
                </tr>
            </table>
          </div>
          <div class="modal-footer">
            <div class="row container-fluid">
                <template v-if="isEditing" class="d-flex p-2">
                    
                    <div class="col me-auto text-end gx-2 ">
                        <button type="button" class="btn btn-danger container-fluid" data-bs-target="#confirmationModal" data-bs-toggle="modal">Delete</button>
                    </div>
                    <div class="col auto text-start"></div>
                    <div class="col me-auto text-end gx-2">
                        <button type="button" class="btn btn-secondary container-fluid" @click="cancelEditing">Cancel</button>
                    </div>
                    <div class="col me-auto text-end gx-2">
                        <button type="button" class="btn btn-success container-fluid" @click="saveModifiedBook">Save</button>
                    </div>

                </template>
                <template v-else>

                    <div class="col auto text-start"></div>
                    <div class="col me-auto text-end gx-2">
                        <button type="button" class="btn btn-secondary container-fluid" data-bs-dismiss="modal">Close</button>
                    </div>
                    <div class="col me-auto text-end gx-2">
                        <button type="button" class="btn btn-warning container-fluid" @click="startEditing">Edit</button>
                    </div>

                </template>
            </div>
          </div>
      </div>
  </div>
</div>
<!-- Confirmation Modal -->
<confirmation-modal :target="'#bookInfoModal'" @confirmed="deleteBook"></confirmation-modal>
  `,
    components: {
        confirmationModal
    },
    emits: ["bookUpdated", "bookDeleted"],
    props: {
        bookInModal: {},
    },
    data() {
        return {
            isEditing: false,
            modifiedBook: {}
        }
    },
    methods: {
        startEditing() {
            this.modifiedBook = { ...this.bookInModal }
            this.isEditing = true
        },
        cancelEditing() {
            this.isEditing = false
        },
        async saveModifiedBook() {
            // client form validation
            const { title, description, author, releasedate, language, booklength, price } = this.modifiedBook
            console.log("Saving:", this.modifiedBook)

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

            const rawResponse = await fetch(this.API_URL + "/books/" + this.modifiedBook.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.modifiedBook)
            });
            console.log(rawResponse);
            this.$emit("bookUpdated", this.modifiedBook)
            this.isEditing = false
        },
        async deleteBook() {
            console.log("DELETE confirmed", this.modifiedBook.id);
            const res = await fetch(this.API_URL + "/books/" + this.modifiedBook.id, {
                method: 'DELETE'
            })
            console.log(res.status)
            this.$emit('bookDeleted', { id: this.modifiedBook.id, status: res.status })
            this.cancelEditing()
        }
    }
}