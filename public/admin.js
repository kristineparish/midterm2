var app = new Vue({
  el: '#admin',
  data: {
    title: "",
    description: "",
    path: "",
    items: [],
    addItem: null,
    findTitle: "",
    findItem: null,
  },
  created() {
    this.getItems();
    console.log("Number of items: " + this.items.length);
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async upload() {
      try {
        let r1 = await axios.post('/api/items', {
          title: this.title,
          description: this.description,
          path: this.path,
        });
        this.addItem = r1.data;
        this.getItems();
      }
      catch (error) {
        console.log(error);
      }
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        this.sortItems();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    async editItem(item) {
      try {
        let response = await axios.put("/api/items/" + item._id, {
          title: this.findItem.title,
          description: this.findItem.description,
        });
        this.findItem = null;
        this.getItems();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async deleteItem(item) {
      try {
        let response = axios.delete("/api/items/" + item._id);
        this.findItem = null;
        this.getItems();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    sortItems() {
      console.log("sort items")
      console.log(this.items);
      this.items.sort(function(a, b) {
        var x = a.title.toLowerCase();
        var y = b.title.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        console.log(this.items);
        return 0;
      });
    }
  }
});
