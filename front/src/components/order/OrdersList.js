export default {
    /*html*/
    template: `
    <table id="ordersTable" class="table table-striped table-bordered">
        <thead>
            <tr>
                <th>Order number</th>
                <th>User</th>
                <th>Return Date</th>
                <th>Rental Date</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="order in orders">
                <td @click="getOrder(order.id)">{{ order.ordernr }}</td>
                <td>{{ order.User.email }}</td>
                <td>{{ order.returndate }}</td>
                <td>{{ order.rentaldate }}</td>
            </tr>
        </tbody>
    </table>
    `,
    emits: ["showModal"],
    data() {
        return {
            orders: [],
        }
    },
    async created() {
        this.orders = await (await fetch(this.API_URL + "/orders")).json()
    },
    methods: {
        getOrder: async function (id) {
            const orderInModal = await (await fetch(this.API_URL + "/orders/" + id)).json()

            if (orderInModal.rentaldate) {
                // parse data
                const dt = new Date(orderInModal.rentaldate)

                // format date for input value
                const day = ("0" + dt.getDate()).slice(-2)
                const month = ("0" + (dt.getMonth() + 1)).slice(-2)
                const date = dt.getFullYear() + "-" + month + "-" + day

                orderInModal.rentaldate = date
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
            // console.log("got order", {...orderInModal})
            // if (orderInModal.OrderItems) {
            //     orderInModal.OrderItems = orderInModal.OrderItems.map(item => {
            //         return {
            //             id: item.id,
            //             OrderId: item.OrderId,
            //             BookId: item.BookId,

            //             // bookId: item.Book.id,
            //             bookTitle: item.Book.title,
            //             bookAuthor: item.Book.author,
            //             bookPrice: item.Book.price
            //         }
            //     })
            // }
            // if (orderInModal.User) {
            //     orderInModal.User = {
            //         email: orderInModal.User.email
            //     }
            // }

            this.$emit("showModal", orderInModal)
        },
    },
}