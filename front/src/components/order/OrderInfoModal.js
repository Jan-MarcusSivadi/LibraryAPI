import confirmationModal from "../ConfirmationModal.js"
export default {
    /*html*/
    template: `
<!-- Order Info Modal -->
<div id="orderInfoModal" class="modal" tabindex="-1">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 v-if="isEditing" class="modal-title">Edit {{staticObj.ordernr}}</h5>
              <h5 v-else class="modal-title">{{staticObj.ordernr}}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          
          <div class="modal-body">

            <div v-if="isEditing">
                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="ordernr" class="row-sm-10 col-form-label">Order number</label>
                                <div class="row-sm-auto">
                                    <input id="ordernr" name="ordernr" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter order number" v-model="orderInModal.ordernr">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label for="returndate" class="row-sm-10 col-form-label">Return date</label>
                                <div class="row-sm-10">
                                    <input id="returndate" name="returndate" type="date" class="form-control" aria-describedby="emailHelp" placeholder="Enter return date" v-model="orderInModal.returndate">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="container">
                        <div class="row justify-content-md-center">
                            <div class="col-md-10">
                                <label v-if="shoppingCart.length > 0"class="row-sm-10 col-form-label">Ordered items</label>
                                <div class="row-sm-10">
                                    <table class="table table-striped table-bordered">
                                        <tbody>
                                            <tr :key="updateItems" v-for="item in shoppingCart">
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
                </div>
            </div>
            <table v-else class="table table-striped">
                <tr>
                    <th>Id</th>
                    <td>{{staticObj.id}}</td>
                </tr>
                <tr>
                    <th>Order number</th>
                    <td>{{staticObj.ordernr}}</td>
                </tr>
                <tr>
                    <th>Rental date</th>
                    <td>{{staticObj.rentaldate}}</td>
                </tr>
                <tr>
                    <th>Return date</th>
                    <td>{{staticObj.returndate}}</td>
                </tr>
                <tr>
                    <th>Made by</th>
                    <td>{{staticObj.User?.email}}</td>
                </tr>               
            </table>

            <div v-if="!isEditing" class="col-sm-10 container-fluid">
                <label class="row-sm-10 col-form-label">Ordered items</label>
                <div class="row-sm-10">
                    <table class="table table-striped table-bordered">
                        <tbody>
                            <tr :key="updateItems" v-for="item in staticObj.OrderItems">
                                <td>
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
          <div class="modal-footer">
            <div class="row container-fluid">
                <template v-if="isEditing" class="d-flex p-2">
                    
                    <div class="col me-auto text-end gx-2 ">
                        <button type="button" class="btn btn-danger container-fluid" data-bs-target="#confirmationModal" data-bs-toggle="modal">Delete</button>
                    </div>
                    <div class="col auto text-start"></div>
                    <div class="col me-auto text-end gx-2">
                        <button type="button" class="btn btn-secondary container-fluid" @click="cancelEditing">Cancel</button>
                    </div>
                    <div class="col me-auto text-end gx-2">
                        <button type="button" class="btn btn-success container-fluid" @click="savemodifiedOrder">Save</button>
                    </div>

                </template>
                <template v-else>

                    <div class="col auto text-start"></div>
                    <div class="col me-auto text-end gx-2">
                        <button type="button" class="btn btn-secondary container-fluid" data-bs-dismiss="modal">Close</button>
                    </div>
                    <div class="col me-auto text-end gx-2">
                        <button type="button" class="btn btn-warning container-fluid" @click="startEditing">Edit</button>
                    </div>

                </template>
            </div>
          </div>
      </div>
  </div>
</div>
<!-- Confirmation Modal -->
<confirmation-modal :target="'#orderInfoModal'" @confirmed="deleteorder"></confirmation-modal>
  `,
    components: {
        confirmationModal
    },
    emits: ["orderUpdated", "orderDeleted"],
    props: {
        orderInModal: {},
        staticObj: {}
    },
    data() {
        return {
            isEditing: false,
            modifiedOrder: {},
            shoppingCart: [],
            updateItems: 1,
        }
    },
    methods: {
        startEditing() {
            this.modifiedOrder = { ...this.orderInModal }
            this.shoppingCart = this.staticObj.OrderItems
            this.isEditing = true
        },
        cancelEditing() {
            this.isEditing = false
        },
        removeItemBook(id) {
            var OrderItems = this.staticObj.OrderItems
            const foundItem = OrderItems.find(i => i.id === id)
            OrderItems = OrderItems.filter(item => item !== foundItem)
            // console.log(OrderItems)
            // this.shoppingCart = OrderItems
            // this.modifiedOrder.OrderItems = this.shoppingCart
        },
        async savemodifiedOrder() {
            // client form validation
            const updatedOrder = this.orderInModal
            const { ordernr, rentaldate, returndate, UserId, itemTitle, itemAuthor, itemPrice } = updatedOrder

            console.log("Creating:", this.modifiedOrder)

            console.log("Saving:", updatedOrder)

            const rawResponse = await fetch(this.API_URL + "/orders/" + updatedOrder.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedOrder)
            });
            console.log("updateOrder", rawResponse);
            this.$emit("orderUpdated", updatedOrder)
            this.isEditing = false
        },
        async deleteorder() {
            console.log("DELETE confirmed", this.modifiedOrder.id);
            const res = await fetch(this.API_URL + "/orders/" + this.modifiedOrder.id, {
                method: 'DELETE'
            })
            console.log(res.status)
            this.$emit('orderDeleted', { id: this.modifiedOrder.id, status: res.status })
            this.cancelEditing()
        }
    }
}