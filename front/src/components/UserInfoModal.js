import confirmationModal from "./ConfirmationModal.js"
export default {
    /*html*/
    template: `
<!-- User Info Modal -->
<div id="userInfoModal" class="modal" tabindex="-1">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <table class="table table-striped">
                  <tr>
                      <th>Id</th>
                      <td>{{userInModal.id}}</td>
                  </tr>
                  <tr>
                      <th>First Name</th>
                      <td v-if="isEditing"><input v-model="modifiedUser.firstname"></td>
                      <td v-else>{{userInModal.firstname}}</td>
                  </tr>
                  <tr>
                      <th>Last Name</th>
                      <td v-if="isEditing"><input v-model="modifiedUser.lastname"></td>
                      <td v-else>{{userInModal.lastname}}</td>
                  </tr>
                  <tr>
                      <th>Email</th>
                      <td v-if="isEditing"><input v-model="modifiedUser.email"></td>
                      <td v-else>{{userInModal.email}}</td>
                  </tr>
                  <tr>
                    <th>Username</th>
                    <td v-if="isEditing"><input v-model="modifiedUser.username"></td>
                    <td v-else>{{userInModal.username}}</td>
                  </tr>
                  <tr>
                    <th>Phone nr.</th>
                    <td v-if="isEditing"><input v-model="modifiedUser.phonenr"></td>
                    <td v-else>{{userInModal.phonenr}}</td>
                  </tr>
              </table>
          </div>
          <div class="modal-footer">
            <div class="row">
                <template v-if="isEditing">
                    <div class="col me-auto">
                        <button type="button" class="btn btn-danger" data-bs-target="#confirmationModal" data-bs-toggle="modal">Delete</button>
                    </div>
                    <div class="col auto">
                        <button type="button" class="btn btn-success" @click="saveModifiedUser">Save</button>
                        <button type="button" class="btn btn-secondary" @click="cancelEditing">Cancel</button>
                    </div>
                </template>
                <template v-else>
                    <div class="col me-auto"></div>
                    <div class="col auto">
                        <button type="button" class="btn btn-warning" @click="startEditing">Edit</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </template>
            </div>
          </div>
      </div>
  </div>
</div>
<!-- Confirmation Modal -->
<confirmation-modal :target="'#userInfoModal'" @confirmed="deleteUser"></confirmation-modal>
  `,
    components: {
        confirmationModal
    },
    emits: ["userUpdated", "userDeleted"],
    props: {
        userInModal: {},
    },
    data() {
        return {
            isEditing: false,
            modifiedUser: {}
        }
    },
    methods: {
        startEditing() {
            this.modifiedUser = { ...this.userInModal }
            this.isEditing = true
        },
        cancelEditing() {
            this.isEditing = false
        },
        async saveModifiedUser() {
            console.log("Saving:", this.modifiedUser)
            const rawResponse = await fetch(this.API_URL + "/users/" + this.modifiedUser.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.modifiedUser)
            });
            console.log(rawResponse);
            this.$emit("userUpdated", this.modifiedUser)
            this.isEditing = false
        },
        async deleteUser() {
            console.log("DELETE confirmed", this.modifiedUser.id);
            const res = await fetch(this.API_URL + "/users/" + this.modifiedUser.id, {
                method: 'DELETE'
            })
            console.log(res.status)
            this.$emit('userDeleted', { id: this.modifiedUser.id, status: res.status })
            this.cancelEditing()
        }
    }
}