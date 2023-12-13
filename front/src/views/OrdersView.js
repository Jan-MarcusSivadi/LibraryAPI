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
    <order-info-modal @orderUpdated="updateView" :orderInModal="orderInModal" @orderDeleted="orderDeleted"></order-info-modal>
    <order-create-modal @getFiltered="getFiltered"@orderCreated="orderCreated" :orderInModal="orderInModal" @orderDeleted="orderDeleted"></order-create-modal>
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
                existingOrders: []
            },
            myModal: null,
            myModalCreate: null,
        }
    },
    created() {
        // this.orderInModal.hello = "?"
    },
    methods: {
        // async getFiltered(books) {
        //     console.log("getFiltered books", books)
        //     const orders = await (await fetch(this.API_URL + "/orders")).json()
        //     console.log("allOrders", orders)
        //     const existingOrders = orders.map(order => {
        //         return {
        //             itemIds: order.OrderItems.map(item => item.BookId),
        //             userId: order.UserId
        //         }
        //     })
        //     // console.log("all ids", existingOrders)
        //     this.orderInModal.existingOrders = existingOrders
        //     return existingOrders
        // },
        openModal(order) {
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
            // const modal = bootstrap.Modal(document.getElementById("orderCreateModal"))
            this.update++
        },
        updateView(order) {
            this.update++
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