import ordersList from "../components/order/OrdersList.js"
import orderInfoModal from "../components/order/OrderInfoModal.js"
import orderCreateModal from "../components/order/OrderCreateModal.js"

export default {
    /*html*/
    template: `
    <div style="display: flex; padding: 10px 20px">
        <h2>Orders</h2>
        <div style="display: flex; justify-content: end; width: 100%;">
            <button style="margin: 0 15px;" type="button" class="btn btn-secondary" @click.prevent="openCreateModal">Create New</button>
        </div>
    </div>
    <orders-list :key="update" @showModal="openModal"></orders-list>
    <order-info-modal @orderUpdated="updateView" :staticObj="staticObj" :orderInModal="orderInModal" @orderDeleted="orderDeleted"></order-info-modal>
    <order-create-modal @orderCreated="orderCreated" :orderInModal="orderInModal" @orderDeleted="orderDeleted"></order-create-modal>
    `,
    components: {
        ordersList,
        orderInfoModal,
        orderCreateModal
    },
    data() {
        return {
            update: 0,
            orderInModal: {
                id: "",
                ordernr: "",
                rentaldate: "",
                returndate: "",
                UserId: "",
                OrderItems: "",
                User: "",
                existingOrders: ""
            },
            staticObj: {},
            myModal: null,
            myModalCreate: null,
        }
    },
    methods: {
        openModal(order) {
            this.staticObj = { ...order }
            console.log("open order modal", this.staticObj)

            this.orderInModal = order
            if (this.myModal === null) {
                this.myModal = new bootstrap.Modal(document.getElementById("orderInfoModal"))
            }
            this.myModal.show()
        },
        openCreateModal() {
            if (this.myModalCreate === null) {
                this.myModalCreate = new bootstrap.Modal(document.getElementById("orderCreateModal"))
            }
            this.myModalCreate.show()
        },
        orderCreated() {
            this.myModalCreate.hide()
            this.update++
        },
        updateView(order) {
            this.update++
            this.staticObj = { ...order }

            this.orderInModal = order
        },
        orderDeleted(res) {
            console.log(res)
            if (res.status !== 204) {
                return alert("Order could not be deleted")
            }
            this.update++
        }
    }
}