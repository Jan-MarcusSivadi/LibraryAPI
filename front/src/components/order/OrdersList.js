export default {
    /*html*/
    template: `
    <table id="ordersTable" class="table table-striped table-bordered">
        <thead>
            <tr>
                <th>Order Number</th>
                <th>Rental Date</th>
                <th>Return Date</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="order in orders">
                <td @click="getOrder(order.id)">{{ order.ordernr }}</td>
                <td>{{ order.rentaldate }}</td>
                <td>{{ order.returndate }}</td>
            </tr>
        </tbody>
    </table>
    `,
    emits: ["showModal"],
    data() {
        return {
            orders: []
        }
    },
    async created() {
        this.orders = await (await fetch(this.API_URL + "/orders")).json()
    },
    methods: {
        getOrder: async function (id) {
            const orderInModal = await (await fetch(this.API_URL + "/orders/" + id)).json()
            
            if (orderInModal.releasedate) {
                // parse data
                const dt = new Date(orderInModal.releasedate)

                // format date for input value
                const day = ("0" + dt.getDate()).slice(-2)
                const month = ("0" + (dt.getMonth() + 1)).slice(-2)
                const date = dt.getFullYear() + "-" + month + "-" + day
    
                orderInModal.releasedate = date
            }

            if (orderInModal.returndate) {
                // parse data
                const dt = new Date(orderInModal.returndate)

                // format date for input value
                const day = ("0" + dt.getDate()).slice(-2)
                const month = ("0" + (dt.getMonth() + 1)).slice(-2)
                const date = dt.getFullYear() + "-" + month + "-" + day
    
                orderInModal.returndate = date
            }

            this.$emit("showModal", orderInModal)
        },
    },
}