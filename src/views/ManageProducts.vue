<template>
  <v-container class="py-8 min-vh-100">
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-black text-grey-darken-4">
        จัดการสินค้า (Manage Products)
      </h1>
      <div class="d-flex align-center">
        <v-switch
          v-model="showInactive"
          label="แสดงสินค้าที่ถูกระงับ"
          @change="fetchData"
          class="mr-4 mt-0 pt-0"
          hide-details
          color="orange"
        ></v-switch>
        <v-btn
          color="orange"
          dark
          class="font-weight-bold"
          @click="openDialog()"
        >
          <v-icon left>mdi-plus</v-icon> เพิ่มสินค้าใหม่
        </v-btn>
      </div>
    </div>

    <v-card class="rounded-xl elevation-2">
      <v-data-table
        :headers="headers"
        :items="myProducts"
        :loading="loading"
        class="elevation-0"
      >
        <template v-slot:[`item.image`]="{ item }">
          <v-avatar rounded="lg" size="50" class="my-2">
            <v-img :src="getImageUrl(item.image)"></v-img>
          </v-avatar>
        </template>

        <template v-slot:[`item.price`]="{ item }">
          <span class="font-weight-bold orange--text"
            >฿{{ formatPrice(item.price) }}</span
          >
        </template>

        <template v-slot:[`item.stock`]="{ item }">
          <v-chip :color="item.stock > 0 ? 'success' : 'error'" small dark>
            {{ item.stock }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div v-if="!item.isActive">
            <v-btn
              small
              color="success"
              class="font-weight-bold"
              @click="restoreItem(item)"
            >
              <v-icon left>mdi-restore</v-icon> กู้คืน
            </v-btn>
          </div>
          <div v-else>
            <v-btn
              icon
              color="blue"
              small
              class="mr-2"
              @click="openDialog(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" small @click="confirmDelete(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card class="rounded-xl">
        <v-card-title class="text-h5 font-weight-bold pa-5 border-b">
          {{ isEditing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่" }}
        </v-card-title>

        <v-card-text class="pa-5">
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="editedItem.name"
              label="ชื่อสินค้า"
              outlined
              dense
              :rules="[(v) => !!v || 'กรุณากรอกชื่อสินค้า']"
              class="mb-2"
              required
            ></v-text-field>

            <v-textarea
              v-model="editedItem.description"
              label="รายละเอียด"
              outlined
              dense
              rows="3"
              class="mb-2"
            ></v-textarea>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedItem.price"
                  label="ราคา (บาท)"
                  type="number"
                  outlined
                  dense
                  required
                  :rules="[(v) => v > 0 || 'ราคาต้องมากกว่า 0']"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedItem.stock"
                  label="จำนวนในสต๊อก"
                  type="number"
                  outlined
                  dense
                  required
                  :rules="[(v) => v > 0 || 'สต๊อกต้องมากกว่า 0']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-file-input
              clearable
              v-model="imageFile"
              label="อัปโหลดรูปภาพสินค้า"
              accept="image/*"
              outlined
              dense
              required
              :rules="[(v) => !!v || 'กรุณาอัปโหลดรูปภาพสินค้า']"
              prepend-icon="mdi-camera"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="closeDialog"
            class="font-weight-bold"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="orange"
            dark
            @click="saveProduct"
            :loading="saving"
            class="font-weight-bold px-6"
          >
            บันทึก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { getProducts } from "@/services/product.service";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/manage.service";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";

export default {
  name: "ManageProducts",
  data() {
    return {
      products: [],
      loading: false,
      showInactive: false,
      dialog: false,
      valid: true,
      saving: false,
      isEditing: false,
      imageFile: null,
      editedItem: {
        _id: null,
        name: "",
        description: "",
        price: 0,
        stock: 0,
      },
      defaultItem: {
        _id: null,
        name: "",
        description: "",
        price: 0,
        stock: 0,
      },
      headers: [
        { text: "รูปภาพ", value: "image", sortable: false },
        { text: "ชื่อสินค้า", value: "name" },
        { text: "ราคา", value: "price" },
        { text: "สต๊อก", value: "stock" },
        { text: "ร้านค้า", value: "shop.username" },
        { text: "จัดการ", value: "actions", sortable: false, align: "right" },
      ],
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
    myProducts() {
      // Admin เห็นทั้งหมด, Shop เห็นเฉพาะของตัวเอง
      if (!this.getUser) return [];
      if (this.getUser.role === "admin") return this.products;
      return this.products.filter(
        (p) => p.shop && p.shop._id === this.getUser.id,
      );
    },
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const response = await getProducts(this.showInactive);
        this.products = response.data.data;
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "โหลดข้อมูลล้มเหลว", "error");
      } finally {
        this.loading = false;
      }
    },
    getImageUrl(imagePath) {
      if (!imagePath) return "https://via.placeholder.com/50?text=No+Img";
      return `http://localhost:3005${imagePath}`;
    },
    formatPrice(price) {
      return new Intl.NumberFormat("th-TH").format(price);
    },
    openDialog(item) {
      if (item) {
        this.isEditing = true;
        this.editedItem = Object.assign({}, item);
      } else {
        this.isEditing = false;
        this.editedItem = Object.assign({}, this.defaultItem);
      }
      this.imageFile = null;
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.$refs.form.resetValidation();
    },
    async saveProduct() {
      if (!this.$refs.form.validate()) return;

      this.saving = true;
      const formData = new FormData();
      formData.append("name", this.editedItem.name);
      formData.append("description", this.editedItem.description);
      formData.append("price", this.editedItem.price);
      formData.append("stock", this.editedItem.stock);

      if (this.imageFile) {
        formData.append("image", this.imageFile);
      }

      try {
        if (this.isEditing) {
          await updateProduct(this.editedItem._id, formData);
          Swal.fire({
            title: "สำเร็จ",
            text: "แก้ไขข้อมูลเรียบร้อย",
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          await createProduct(formData);
          Swal.fire({
            title: "สำเร็จ",
            text: "เพิ่มสินค้าใหม่เรียบร้อย",
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        this.closeDialog();
        await this.fetchData();
      } catch (error) {
        Swal.fire(
          "ผิดพลาด",
          error.response?.data?.message || "บันทึกไม่สำเร็จ",
          "error",
        );
      } finally {
        this.saving = false;
      }
    },
    async confirmDelete(item) {
      const result = await Swal.fire({
        title: "ยืนยันการระงับการขาย?",
        text: `คุณต้องการระงับ/ซ่อนสินค้า ${item.name} ใช่หรือไม่?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ระงับการขาย",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        try {
          await deleteProduct(item._id);
          Swal.fire({
            title: "ระงับการขายแล้ว!",
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
          });
          await this.fetchData();
        } catch (error) {
          Swal.fire("ผิดพลาด", "ไม่สามารถระงับการขายได้", "error");
        }
      }
    },
    async restoreItem(item) {
      const result = await Swal.fire({
        title: "ยืนยันการกู้คืน",
        text: `คุณต้องการกู้คืนสินค้า ${item.name} ให้กลับมาขายได้ปกติใช่หรือไม่?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4CAF50",
        cancelButtonColor: "#9e9e9e",
        confirmButtonText: "ใช่, กู้คืน",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        try {
          // Import restoreProduct will be added in script tags if missing, but wait, I didn't add restoreProduct import yet. Let's fix that.
          // Wait, I need to add it to the import statement.
          await this.$options.methods.executeRestore.call(this, item._id);
        } catch (error) {
          // fallback
        }
      }
    },
    async executeRestore(id) {
      try {
        const { restoreProduct } = require("@/services/product.service");
        await restoreProduct(id);
        Swal.fire({
          title: "กู้คืนสำเร็จ!",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
        await this.fetchData();
      } catch (error) {
        Swal.fire("ผิดพลาด", "ไม่สามารถกู้คืนได้", "error");
      }
    },
  },
};
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}
.border-b {
  border-bottom: 1px solid #eeeeee;
}
</style>
