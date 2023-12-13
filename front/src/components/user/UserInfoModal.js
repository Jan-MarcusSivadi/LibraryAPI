import confirmationModal from "../ConfirmationModal.js"
export default {
    /*html*/
    template: `
<!-- User Info Modal -->
<div id="userInfoModal" class="modal" tabindex="-1">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 v-if="isEditing" class="modal-title">Edit {{modifiedUser.username}}</h5>
              <h5 v-else class="modal-title">{{modifiedUser.username}}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

              <div v-if="isEditing">
                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="firstname" class="row-sm-10 col-form-label">First Name</label>
                                <div class="row-sm-10">
                                    <input id="firstname" name="firstname" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter firstname" v-model="userInModal.firstname">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="lastname" class="row-sm-10 col-form-label">Last Name</label>
                                <div class="row-sm-10">
                                    <input id="lastname" name="lastname" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter lastname" v-model="userInModal.lastname">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="email" class="row-sm-10 col-form-label">Email</label>
                                <div class="row-sm-10">
                                    <input id="email" name="email" type="email" class="form-control" aria-describedby="emailHelp" placeholder="Enter email" v-model="userInModal.email">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="password" class="row-sm-10 col-form-label">Password</label>
                                <div class="row-sm-10">
                                    <input id="password" name="password" type="password" class="form-control" aria-describedby="emailHelp" placeholder="Enter password" v-model="userInModal.password">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="username" class="row-sm-10 col-form-label">Username</label>
                                <div class="row-sm-auto">
                                    <input id="username" name="username" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter username" v-model="userInModal.username">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="phonenr" class="row-sm-10 col-form-label">Phone Number</label>
                                <div class="row-sm-10">
                                    <input id="phonenr" name="phonenr" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter phonenr" v-model="userInModal.phonenr">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
          
            <table v-else class="table table-striped">
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
                    <th>Phone Number</th>
                    <td v-if="isEditing"><input v-model="modifiedUser.phonenr"></td>
                    <td v-else>{{userInModal.phonenr}}</td>
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
                        <button type="button" class="btn btn-success container-fluid" @click="saveModifiedUser">Save</button>
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
            // client form validation
            const updatedUser = this.userInModal
            const { firstname, lastname, email, password, username, phonenr } = updatedUser

            // document.querySelector('.submit-form').addEventListener('submit', (e) => {
            //     e.preventDefault()
            // })

            if (!firstname) {
                return alert("First Name field is required")
            }
            if (!lastname) {
                return alert("Last Name field is required")
            }

            if (!email) {
                return alert("Email field is required")
            }
            if (!password) {
                return alert("Password field is required")
            }
            if (!username) {
                return alert("Username field is required")
            }

            if (!phonenr) {
                return alert("Phone Number field is required")
            }
            console.log("Saving:", updatedUser)
            const rawResponse = await fetch(this.API_URL + "/users/" + updatedUser.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser)
            });
            console.log(rawResponse);
            this.$emit("userUpdated", updatedUser)
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