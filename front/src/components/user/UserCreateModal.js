export default {
    /*html*/
    template: `
        <!-- User Info Modal -->
<div id="userCreateModal" class="modal" tabindex="-1">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">New User</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form class="submit-button">
            <div class="modal-body" >

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="firstname" class="row-sm-10 col-form-label">First Name</label>
                                <div class="row-sm-10">
                                    <input id="firstname" name="firstname" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter firstname" v-model="modifiedUser.firstname">
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
                                    <input id="lastname" name="lastname" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter lastname" v-model="modifiedUser.lastname">
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
                                    <input id="email" name="email" type="email" class="form-control" aria-describedby="emailHelp" placeholder="Enter email" v-model="modifiedUser.email">
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
                                    <input id="password" name="password" type="password" class="form-control" aria-describedby="emailHelp" placeholder="Enter password" v-model="modifiedUser.password">
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
                                    <input id="username" name="username" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter username" v-model="modifiedUser.username">
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
                                    <input id="phonenr" name="phonenr" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter phonenr" v-model="modifiedUser.phonenr">
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
                    <button type="button" class="btn btn-success container-fluid" @click="saveCreatedUser">Create</button>
                    </div>

                </div>
            </div>
        </form>
    </div>
</div>
</div>
    `,
    emits: ["userCreated"],
    data() {
        return {
            modifiedUser: {}
        }
    },
    methods: {
        async saveCreatedUser() {
            // client form validation
            const { firstname, lastname, email, password, username, phonenr } = this.modifiedUser

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
            console.log("Creating:", this.modifiedUser)

            const rawResponse = await fetch(this.API_URL + "/users", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.modifiedUser)
            });

            if (rawResponse.status !== 201) {
                return alert("User could not be created!")
            }

            console.log(rawResponse);
            this.$emit("userCreated")
        },
    }
}