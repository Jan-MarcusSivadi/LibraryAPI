import usersList from "../components/user/UsersList.js"
import userInfoModal from "../components/user/UserInfoModal.js"
import userCreateModal from "../components/user/UserCreateModal.js"

export default {
    /*html*/
    template: `
    <div style="display: flex; padding: 10px 20px">
        <h2>Users</h2>
        <div style="display: flex; justify-content: end; width: 100%;">
            <button style="margin: 0 15px;" type="button" class="btn btn-secondary" @click="openCreateModal">Create New</button>
        </div>
    </div>
    <users-list :key="update" @showModal="openModal"></users-list>
    <user-info-modal @userUpdated="updateView" :staticObj="staticObj" :userInModal="userInModal" @userDeleted="userDeleted"></user-info-modal>
    <user-create-modal @userCreated="userCreated" :userInModal="userInModal" @userDeleted="userDeleted"></user-create-modal>
    `,
    components: {
        usersList,
        userInfoModal,
        userCreateModal
    },
    data() {
        return {
            update: 0,
            userInModal: { 
                id: "", 
                username: "", 
                firstname: "", 
                lastname: "", 
                email: "", 
                phonenr: "", 
            },
            staticObj: {},
            myModal: null,
            myModalCreate: null,
        }
    },
    methods: {
        openModal(user) {
            this.staticObj = { ...user }

            this.userInModal = user
            let userInfoModal = new bootstrap.Modal(document.getElementById("userInfoModal"))
            userInfoModal.show()
        },
        openCreateModal() {
            // this.userInModal = user
            if (this.myModalCreate === null) {
                this.myModalCreate = new bootstrap.Modal(document.getElementById("userCreateModal"))
            }
            this.myModalCreate.show()
        },
        userCreated() {
            this.myModalCreate.hide()
            this.update++
        },
        updateView(user) {
            this.update++
            this.staticObj = { ...user }

            this.userInModal = user
        },  
        userDeleted(res) {
            console.log(res)
            if (res.status !== 204) {
                return alert("User could not be deleted")
            }
            this.update++
        }
    }
}