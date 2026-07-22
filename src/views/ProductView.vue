<template>
  <div class="product-page bg-grey-lighten-4 min-vh-100 pb-10">
    <!-- Hero Banner -->
    <v-card flat tile class="hero-section mb-10 overflow-hidden" dark>
      <v-img
        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop"
        height="300"
        gradient="to right, rgba(28,25,23,0.9), rgba(234,88,12,0.6)"
        class="align-center"
      >
        <v-container>
          <v-row>
            <v-col cols="12" md="8">
              <v-chip
                color="orange"
                text-color="white"
                class="mb-4 font-weight-bold"
                small
              >
                NEW ARRIVALS
              </v-chip>
              <h1 class="text-h3 font-weight-black mb-3 text-white">
                New Products
              </h1>
              <p class="text-h6 font-weight-regular opacity-80 max-w-lg">
                Shop the latest collections from top-rated sellers. Quality
                guaranteed on every order.
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-img>
    </v-card>

    <v-container>
      <!-- Section Header & Controls -->
      <v-row class="align-center mb-6 px-2">
        <h2 class="text-h4 font-weight-black text-grey-darken-4 m-0">
          All Products
        </h2>
        <v-spacer></v-spacer>
        <v-btn text color="grey darken-1" class="font-weight-bold mr-2">
          <v-icon left>mdi-filter-variant</v-icon> Filter
        </v-btn>
        <v-btn outlined color="grey darken-2" class="rounded-pill">
          Sort by: Newest <v-icon right>mdi-chevron-down</v-icon>
        </v-btn>
      </v-row>

      <!-- Loading State -->
      <v-row v-if="loading" justify="center" class="mt-10 mb-10">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            indeterminate
            color="orange"
            size="64"
            width="6"
          ></v-progress-circular>
          <p class="mt-4 text-h6 font-weight-bold grey--text">
            Loading premium products...
          </p>
        </v-col>
      </v-row>

      <!-- Products Grid -->
      <v-row v-else class="product-grid">
        <v-col
          v-for="product in products"
          :key="product._id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="mb-4 px-3"
        >
          <product-card :product="product" />
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-row
        v-if="!loading && products.length === 0"
        justify="center"
        class="mt-10"
      >
        <v-col cols="12" class="text-center py-10">
          <v-avatar color="grey lighten-4" size="120" class="mb-6">
            <v-icon size="64" color="grey lighten-1"
              >mdi-package-variant-closed</v-icon
            >
          </v-avatar>
          <h3 class="text-h5 font-weight-bold grey--text text--darken-2">
            Out of Stock
          </h3>
          <p class="grey--text mt-2">Check back later for new arrivals.</p>
          <v-btn
            color="orange"
            rounded
            class="mt-4 px-8 text-white font-weight-bold"
            depressed
            @click="fetchProducts"
          >
            Refresh
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { getProducts } from "@/services/product.service";
import ProductCard from "@/components/ProductCard.vue";

export default {
  name: "ProductView",
  components: {
    ProductCard,
  },
  data() {
    return {
      products: [],
      loading: false,
      error: null,
    };
  },
  async mounted() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await getProducts();
        this.products = response.data.data;
      } catch (err) {
        this.error = "Failed to load products";
        console.error(err);
      } finally {
        this.loading = false;
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
</style>
