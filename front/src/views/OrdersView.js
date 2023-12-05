import ordersList from "../components/order/OrdersList.js"

export default {
    /*html*/
    template: `
    <div style="display: flex; padding: 10px 20px">
        <h2>Orders</h2>
        <div style="display: flex; justify-content: end; width: 100%;">
            <button style="margin: 0 15px;" type="button" class="btn btn-secondary" @click="openCreateModal">Create New</button>
        </div>
    </div>
    <orders-list :key="update" @showModal="openModal"></orders-list>
    `,
    components: {
        ordersList
    },
    data() {
        return {
            update: 0,
            orderInModal: {
                id: "",
                ordernr: "",
                rentaldate: "",
                returndate: "",
            },
            myModal: null,
            myModalCreate: null,
        }
    },
    methods: {
        openModal(order) {
            this.orderInModal = order
            if (this.myModal === null) {
                this.myModal = new bootstrap.Modal(document.getElementById("orderInfoModal"))
            }
            this.myModal.show()
        },
        openCreateModal() {
            // this.orderInModal = book
            if (this.myModalCreate === null) {
                this.myModalCreate = new bootstrap.Modal(document.getElementById("orderCreateModal"))
            }
            this.myModalCreate.show()
        },
        updateView(order) {
            this.update++
            this.orderInModal = order
        },
    }
}