export default {
    /*html*/
    template: `
        <!-- Order Info Modal -->
<div id="orderCreateModal" class="modal" tabindex="-1">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">New Order</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form class="submit-button">
            <div class="modal-body" >

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="UserId" class="row-sm-10 col-form-label">User ID</label>
                                <div class="dropdown">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        {{getSelectedUser(user)}}
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        <div :key="updateUsers" v-for="user in users">
                                            <li><button @click="addItemUser(user)" class="dropdown-item">{{user.username}}</button></li>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="OrderItems.bookId" class="row-sm-10 col-form-label">Order Items</label>
                                <div class="row-sm-10">
                                    <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            Choose items
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            <div :key="updateBooks" v-for="book in books">
                                                <li><button @click="addItemBook(book)" class="dropdown-item">{{book.title}} {{book.price}}</button></li>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-10">
                                <label v-if="shoppingCart.length > '0'" for="OrderItems.bookId" class="row-sm-10 col-form-label">Selected items</label>
                                <table id="ordersTable" class="table table-striped table-bordered">
                                    <tbody>
                                        <tr :key="updateBookItems" v-for="item in shoppingCart">
                                            <td @click="removeItemBook(item.id)">
                                                <div class="container-fluid" style="display: flex; justify-content: space-between;">
                                                    <div>{{ item.title }}</div>
                                                    <div>{{ item.price }}</div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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
                    <button type="button" class="btn btn-success container-fluid" @click="saveCreatedOrder">Create</button>
                    </div>

                </div>
            </div>
        </form>
    </div>
</div>
</div>
    `,
    emits: ["orderCreated"],
    data() {
        return {
            modifiedOrder: {},
            books: [],
            users: [],
            shoppingCart: [],
            user: "",
            updateBooks: 1,
            updateUsers: 1,
            updateBookItems: 1,
            updateUserItems: 1,
        }
    },
    async created() {
        this.books = await (await fetch(this.API_URL + "/books")).json()
        this.users = await (await fetch(this.API_URL + "/users")).json()
        console.log(this.users)
    },
    methods: {
        getSelectedUser(user) {
            return user.username ? user.username : "Choose user"
        },
        addItemBook(item) {
            const foundItem = this.shoppingCart.find(i => i.id === item.id)
            const isExist = foundItem !== undefined
            if (isExist) return
            this.shoppingCart.push(item)
            this.books = this.books.filter(i => i.id !== item.id)
        },
        removeItemBook(id) {
            const foundItem = this.shoppingCart.find(i => i.id === id)
            this.shoppingCart = this.shoppingCart.filter(item => item !== foundItem)
            this.books.push(foundItem)
        },
        addItemUser(item) {
            if (!item) return
            this.user = item
            // this.users = this.users.filter(u => u.id !== item.id)
            console.log(this.user)
        },
        removeItemUser(id) {
            const foundItem = this.user.id == id
            this.user = ""
            // this.users.push(foundItem)
        },
        async saveCreatedOrder() {
            // client form validation

            const orderItemsSelected = [ ...this.shoppingCart]
            const orderUserSelected = this.user

            if (!orderUserSelected) {
                return alert("User is required!")
            }

            if (orderItemsSelected.length <= 0) {
                return alert("At least 1 item for order is required!")
            }
            this.modifiedOrder.bookIds = orderItemsSelected.map(item => item.id)
            this.modifiedOrder.userId = orderUserSelected.id
            console.log("Creating:", this.modifiedOrder)

            const rawResponse = await fetch(this.API_URL + "/orders", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.modifiedOrder)
            });
            console.log(rawResponse);
            this.$emit("orderCreated")
        },
    }
}