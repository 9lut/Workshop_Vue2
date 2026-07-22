<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="mx-auto rounded-xl transition-swing overflow-hidden d-flex flex-column"
      :elevation="hover ? 16 : 2"
      :class="{ 'card-hover': hover }"
      max-width="380"
      height="100%"
    >
      <div class="image-wrapper relative">
        <v-img
          :src="getImageUrl(product.image)"
          height="240px"
          class="grey lighten-4 align-end card-img"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="orange"
              ></v-progress-circular>
            </v-row>
          </template>

          <!-- Shop Badge Overlay -->
          <div class="pa-3">
            <v-chip
              color="white"
              class="font-weight-black elevation-4 px-3"
              small
              text-color="grey darken-3"
            >
              <v-icon left size="16" color="orange">mdi-storefront</v-icon>
              {{ product.shop.username }}
            </v-chip>
          </div>
        </v-img>
      </div>

      <v-card-text class="pt-5 pb-3 flex-grow-1 d-flex flex-column">
        <div class="d-flex justify-space-between align-start mb-2 gap-2">
          <h3
            class="text-h6 font-weight-black text-truncate grey--text text--darken-4 mb-0"
            style="max-width: 65%"
            :title="product.name"
          >
            {{ product.name }}
          </h3>
          <span class="orange--text text--darken-2 font-weight-black text-h6">
            ฿{{ formatPrice(product.price) }}
          </span>
        </div>

        <p
          class="text-body-2 grey--text text--darken-1 text-truncate-2 mb-4 flex-grow-1"
          style="min-height: 40px"
        >
          {{ product.description }}
        </p>

        <div>
          <v-chip
            :color="product.stock > 0 ? 'success' : 'grey'"
            :outlined="product.stock === 0"
            :dark="product.stock > 0"
            small
            class="font-weight-bold px-3"
          >
            <v-icon left size="14" v-if="product.stock > 0"
              >mdi-check-circle</v-icon
            >
            <v-icon left size="14" v-else>mdi-close-circle</v-icon>
            {{
              product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"
            }}
          </v-chip>
        </div>
      </v-card-text>

      <v-card-actions class="px-5 pb-5 pt-0 mt-auto">
        <v-btn
          color="grey darken-4"
          block
          depressed
          rounded
          dark
          class="font-weight-black text-capitalize add-to-cart-btn py-6"
          :disabled="product.stock === 0"
          @click="handleAddToCart"
        >
          <v-icon left class="mr-2">mdi-cart-plus</v-icon>
          Add to Cart
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async handleAddToCart() {
      const { value: quantity, isConfirmed } = await Swal.fire({
        title: 'ระบุจำนวนที่ต้องการ',
        text: `คุณต้องการเพิ่ม ${this.product.name} ลงในตะกร้ากี่ชิ้น?`,
        icon: 'question',
        input: 'number',
        inputValue: 1,
        inputAttributes: {
          min: 1,
          max: this.product.stock,
          step: 1
        },
        showCancelButton: true,
        confirmButtonText: 'เพิ่มลงตะกร้า',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#ea580c',
        inputValidator: (value) => {
          if (!value || value <= 0) {
            return 'กรุณาระบุจำนวนที่มากกว่า 0'
          }
          if (value > this.product.stock) {
            return `สินค้ามีในสต๊อกเพียง ${this.product.stock} ชิ้น`
          }
        }
      });

      if (isConfirmed && quantity) {
        const productToAdd = {
          ...this.product,
          selectedQuantity: parseInt(quantity, 10)
        };
        
        const result = await this.$store.dispatch("addToCart", productToAdd);
        
        if (result.success) {
          Swal.fire({
            title: "สำเร็จ!",
            text: result.message,
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            title: "เพิ่มสินค้าไม่สำเร็จ!",
            text: result.message,
            icon: "error",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#ea580c"
          });
        }
      }
    },
    getImageUrl(imagePath) {
      if (!imagePath)
        return "https://via.placeholder.com/400x300?text=No+Image";
      return `http://localhost:3005${imagePath}`;
    },
    formatPrice(price) {
      return new Intl.NumberFormat("th-TH").format(price);
    },
  },
};
</script>

<style scoped>
.transition-swing {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.card-hover {
  transform: translateY(-8px);
}
.image-wrapper {
  position: relative;
  overflow: hidden;
}
.card-img {
  transition: transform 0.5s ease;
}
.card-hover .card-img {
  transform: scale(1);
}
.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  transition: transform 0.2s ease;
}
.favorite-btn:hover {
  transform: scale(1.15);
}
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
}
.add-to-cart-btn {
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}
.card-hover .add-to-cart-btn {
  background-color: #ea580c !important; /* Tailwind orange-600 */
}
</style>
