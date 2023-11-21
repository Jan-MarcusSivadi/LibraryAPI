export default {
  /*html*/
  template: `
<div id="bookInfoModal" class="modal" tabindex="-1">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <table class="table table-striped">
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
                      <th>Author</th>
                      <td v-if="isEditing"><input v-model="modifiedBook.author"></td>
                      <td v-else>{{bookInModal.author}}</td>
                  </tr>
                  <tr>
                      <th>Price</th>
                      <td v-if="isEditing"><input v-model="modifiedBook.price"></td>
                      <td v-else>{{bookInModal.price}}</td>
                  </tr>
              </table>
          </div>
          <div class="modal-footer">
              <template v-if="isEditing">
                  <button type="button" class="btn btn-success" @click="saveModifiedBook">Save</button>
                  <button type="button" class="btn btn-secondary" @click="cancelEditing">Cancel</button>
              </template>
              <template v-else>
                  <button type="button" class="btn btn-warning" @click="startEditing">Edit</button>
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </template>
          </div>
      </div>
  </div>
</div>
  `,
  emits: ["bookUpdated"],
  props: {
      bookInModal: {}
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
          console.log("Saving:", this.modifiedBook)
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
      }
  }
}