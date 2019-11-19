var app = new Vue({
  el: '#app',
  data: {
    items: [],
    submittedCart: [],
  },
  created() {
    this.getItems();
  },
  methods: {
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async submitCart() {
      this.updateSubmittedCart();
      try {
        for (let i = 0; i < this.submittedCart.length; i++) {
          console.log("update orders");
          console.log(i);
          let response = await axios.put("/api/items/" + this.submittedCart[i]._id, {
            orders: this.submittedCart[i].orders + 1
          });
          this.getItems();
        }

        return true;
      }
      catch (error) {
        console.log(error);
      }

    },
    chooseItem(item) {
      item.chosen = true;
    },
    updateSubmittedCart() {
      this.submittedCart = this.items.filter(item => item.chosen);
    }
  }
});