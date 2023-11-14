export default {
    /*html*/
    template: `
    <div id="bookInfoModal" class="modal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <table class="table table-striped">
              <tr>
                <th>Id</th>
                <td>{{bookInModal.id}}</td>
              </tr>
              <tr>
                <th>Title</th>
                <td>{{bookInModal.title}}</td>
              </tr>
              <tr>
                <th>Author</th>
                <td>{{bookInModal.author}}</td>
              </tr>
              <tr>
                <th>Price</th>
                <td>{{bookInModal.price}}</td>
              </tr>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    `,
    props: {
        bookInModal: {}
    }
}