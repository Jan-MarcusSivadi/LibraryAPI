import usersList from "../components/UsersList.js"
import userInfoModal from "../components/UserInfoModal.js"
export default {
    /*html*/
    template: `
    <div style="display: flex; padding: 10px 20px">
        <h2>Users</h2>
        <div style="display: flex; justify-content: end; width: 100%;">
            <button style="margin: 0 15px;" type="button" class="btn btn-secondary">Create New</button>
        </div>
    </div>
    <users-list :key="update" @showModal="openModal"></users-list>
    <user-info-modal @userUpdated="updateView" :userInModal="userInModal" @userDeleted="userDeleted"></user-info-modal>
    `,
    components: {
        usersList,
        userInfoModal
    },
    data() {
        return {
            update: 0,
            userInModal: { id: "", username: "", firstname: "", lastname: "", email: "", phonenr: "" },
        }
    },
    methods: {
        openModal(user) {
            this.userInModal = user
            let userInfoModal = new bootstrap.Modal(document.getElementById("userInfoModal"))
            userInfoModal.show()
        },
        updateView(user) {
            this.update++
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