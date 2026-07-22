<template>
  <v-container class="py-8 min-vh-100">
    <h1 class="text-h5 font-weight-black mb-6 text-grey-darken-4">
      Shopping Cart
    </h1>

    <v-row>
      <!-- รายการสินค้า -->
      <v-col cols="12" :md="cart.length > 0 ? 8 : 12">
        <v-card class="rounded-xl elevation-2 mb-4">

          <!-- Empty Cart -->
          <v-card-text
            v-if="cart.length === 0"
            class="text-center py-16"
          >
            <v-icon size="90" color="grey lighten-1">
              mdi-cart-outline
            </v-icon>

            <h2 class="text-h4 font-weight-bold grey--text text--darken-2 mt-6">
              ตะกร้าสินค้าว่างเปล่า
            </h2>

            <p class="grey--text mt-3 text-body-1">
              ยังไม่มีสินค้าในตะกร้าของคุณ
              ลองเลือกซื้อสินค้าที่สนใจได้เลย
            </p>

            <v-btn
              color="orange"
              dark
              large
              rounded
              class="mt-8 px-10"
              :to="{ name: 'product' }"
            >
              <v-icon left>mdi-storefront</v-icon>
              ไปช้อปเลย
            </v-btn>
          </v-card-text>

          <!-- Cart List -->
          <v-list v-else>
            <v-list-item
              v-for="item in cart"
              :key="item._id"
              class="py-4 px-4 border-b"
            >
              <v-list-item-avatar
                rounded="lg"
                size="100"
                class="mr-4"
              >
                <v-img
                  :src="getImageUrl(item.image)"
                  class="grey lighten-3"
                />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title
                  class="text-h6 font-weight-bold mb-1"
                >
                  {{ item.name }}
                </v-list-item-title>

                <v-list-item-subtitle class="grey--text mb-2">
                  Shop : {{ item.shop.username }}
                </v-list-item-subtitle>

                <div class="orange--text font-weight-black text-h6">
                  ฿{{ formatPrice(item.price) }}
                </div>
              </v-list-item-content>

              <v-list-item-action
                class="d-flex flex-row align-center ml-4 mt-0"
              >
                <v-btn
                  icon
                  color="grey"
                  @click="decreaseQuantity(item)"
                  :disabled="item.quantity <= 1"
                >
                  <v-icon>
                    mdi-minus-circle-outline
                  </v-icon>
                </v-btn>

                <span class="font-weight-bold text-h6 mx-3">
                  {{ item.quantity }}
                </span>

                <v-btn
                  icon
                  color="grey"
                  @click="increaseQuantity(item)"
                  :disabled="item.quantity >= item.stock"
                >
                  <v-icon>
                    mdi-plus-circle-outline
                  </v-icon>
                </v-btn>

                <v-btn
                  icon
                  color="red lighten-1"
                  class="ml-4"
                  @click="removeItem(item._id)"
                >
                  <v-icon>
                    mdi-delete-outline
                  </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

        </v-card>
      </v-col>

      <!-- Summary -->
      <v-col
        v-if="cart.length > 0"
        cols="12"
        md="4"
      >
        <v-card
          class="rounded-xl elevation-2 sticky-top"
          style="top:80px;"
        >
          <v-card-title
            class="font-weight-bold text-h5 border-b pb-4"
          >
            Order Summary
          </v-card-title>

          <v-card-text class="pt-6">

            <div class="d-flex justify-space-between mb-4">
              <span class="text-h6 grey--text">
                Total Items
              </span>

              <span class="text-h6 font-weight-bold">
                {{ totalItems }} ชิ้น
              </span>
            </div>

            <div class="d-flex justify-space-between mb-6">
              <span class="text-h6 grey--text">
                Subtotal
              </span>

              <span class="text-h5 font-weight-black orange--text">
                ฿{{ formatPrice(totalPrice) }}
              </span>
            </div>

            <v-divider class="mb-6" />

            <v-btn
              block
              large
              dark
              rounded
              color="orange"
              class="font-weight-bold mb-4"
              @click="handleCheckout"
              :loading="checkingOut"
            >
              <v-icon left>
                mdi-cash-register
              </v-icon>

              Proceed to Checkout
            </v-btn>

            <v-btn
              block
              rounded
              text
              color="grey"
              class="font-weight-bold"
              @click="clearCartItems"
            >
              <v-icon left>
                mdi-delete-sweep
              </v-icon>

              Clear Cart
            </v-btn>

          </v-card-text>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Swal from 'sweetalert2';
import { createOrder } from '@/services/order.service';

export default {
  name: "CartView",
  data() {
    return {
      checkingOut: false
    };
  },
  computed: {
    ...mapGetters({
      cart: "getCart"
    }),
    totalItems() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    },
    totalPrice() {
      return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  },
  methods: {
    ...mapActions(["updateCartQuantity", "removeFromCart", "clearCart"]),
    getImageUrl(imagePath) {
      if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
      return `http://localhost:3005${imagePath}`;
    },
    formatPrice(price) {
      return new Intl.NumberFormat("th-TH").format(price);
    },
    increaseQuantity(item) {
      if (item.quantity < item.stock) {
        this.updateCartQuantity({ productId: item._id, quantity: item.quantity + 1 });
      }
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        this.updateCartQuantity({ productId: item._id, quantity: item.quantity - 1 });
      }
    },
    async removeItem(productId) {
      const result = await Swal.fire({
        title: 'ยืนยันการลบ',
        text: "คุณต้องการลบสินค้านี้ออกจากตะกร้าใช่หรือไม่?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ลบสินค้า',
        cancelButtonText: 'ยกเลิก'
      });
      
      if (result.isConfirmed) {
        this.removeFromCart(productId);
        Swal.fire({
          title: 'ลบเรียบร้อย!',
          text: 'สินค้านี้ถูกนำออกจากตะกร้าแล้ว',
          icon: 'success',
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500
        });
      }
    },
    async clearCartItems() {
      const result = await Swal.fire({
        title: 'ล้างตะกร้า',
        text: "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้าทั้งหมดในตะกร้า?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ใช่, ล้างทั้งหมด!',
        cancelButtonText: 'ยกเลิก'
      });
      
      if (result.isConfirmed) {
        this.clearCart();
        Swal.fire({
          title: 'ตะกร้าว่างเปล่า!',
          text: 'สินค้าทั้งหมดถูกนำออกแล้ว',
          icon: 'success',
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500
        });
      }
    },
    async handleCheckout() {
      if (!this.$store.getters.isAuthenticated) {
        Swal.fire({
          title: 'กรุณาเข้าสู่ระบบ',
          text: 'คุณต้องเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า',
          icon: 'warning',
          confirmButtonText: 'ไปที่หน้า Login'
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push('/login');
          }
        });
        return;
      }

      this.checkingOut = true;
      try {
        // Send order request for each item in the cart
        const orderPromises = this.cart.map(item => createOrder(item._id, item.quantity));
        await Promise.all(orderPromises);

        Swal.fire({
          title: 'สั่งซื้อสำเร็จ! 🎉',
          text: 'เราได้รับคำสั่งซื้อของคุณแล้ว',
          icon: 'success',
          confirmButtonColor: '#4caf50'
        });

        this.clearCart();
        // พาผู้ใช้ไปยังหน้าประวัติการสั่งซื้อ
        this.$router.push('/my-orders').catch(()=>{});
      } catch (error) {
        Swal.fire({
          title: 'สั่งซื้อไม่สำเร็จ',
          text: error.response?.data?.message || 'เกิดข้อผิดพลาดบางอย่าง โปรดลองอีกครั้ง',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      } finally {
        this.checkingOut = false;
      }
    }
  }
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
.sticky-top {
  position: sticky;
}
</style>
