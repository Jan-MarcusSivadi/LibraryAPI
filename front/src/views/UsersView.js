import usersList from "../components/UsersList.js"
import userInfoModal from "../components/UserInfoModal.js"
export default {
    /*html*/
    template: `
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