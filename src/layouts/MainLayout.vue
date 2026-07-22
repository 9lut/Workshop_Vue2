<template>
  <div>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <router-link
          to="/product"
          class="d-flex align-center text-decoration-none"
        >
          <v-img
            alt="Shop Logo"
            class="shrink mr-3"
            contain
            src="/LOGO2.png"
            transition="scale-transition"
            width="40"
          />
          <span class="font-weight-bold text-h5 white--text">EasyShop</span>
        </router-link>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        v-if="
          isAuthenticated &&
          (getUser.role === 'shop' || getUser.role === 'admin')
        "
        text
        :to="{ name: 'manageProducts' }"
        class="hidden-sm-and-down font-weight-bold"
      >
        <v-icon left>mdi-package-variant</v-icon> จัดการสินค้า
      </v-btn>
      <v-btn
        v-if="
          isAuthenticated &&
          (getUser.role === 'shop' || getUser.role === 'admin')
        "
        text
        :to="{ name: 'manageOrders' }"
        class="hidden-sm-and-down font-weight-bold mr-2"
      >
        <v-icon left>mdi-chart-bar</v-icon> ยอดขาย
      </v-btn>
      <v-btn
        v-if="isAuthenticated && getUser.role === 'admin'"
        text
        :to="{ name: 'manageUsers' }"
        class="hidden-sm-and-down font-weight-bold mr-2"
      >
        <v-icon left>mdi-account-group</v-icon> อนุมัติร้านค้า
      </v-btn>

      <v-btn icon class="mr-4" color="darken-3" :to="{ name: 'cart' }">
        <v-badge
          :content="cartCount"
          :value="cartCount > 0"
          color="orange"
          overlap
        >
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>

      <v-btn v-if="!isAuthenticated" offset-y text :to="{ name: 'login' }">
        <v-icon left>mdi-login</v-icon>
        Login
      </v-btn>
      <v-btn v-if="!isAuthenticated" offset-y text :to="{ name: 'register' }">
        <v-icon left>mdi-account-plus</v-icon>
        Register
      </v-btn>

      <v-menu v-else offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon left> mdi-account-circle </v-icon>
            {{ getUser.username }}
            <v-icon right> mdi-chevron-down </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="primary">mdi-shield-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="text-capitalize font-weight-bold">
                {{ getUser.username }}
              </v-list-item-title>
              <v-list-item-subtitle
                >Role : {{ getUser.role }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item :to="{ name: 'myOrders' }">
            <v-list-item-icon>
              <v-icon color="blue">mdi-clipboard-text-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="blue--text font-weight-bold"
              >ประวัติการสั่งซื้อ</v-list-item-title
            >
          </v-list-item>

          <v-divider v-if="getUser.role === 'user'"></v-divider>

          <v-list-item @click="handleLogout">
            <v-list-item-icon>
              <v-icon color="red"> mdi-logout </v-icon>
            </v-list-item-icon>

            <v-list-item-title class="red--text"> Logout </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["isAuthenticated", "getUser", "cartCount"]),
  },
  methods: {
    ...mapActions(["logout"]),

    handleLogout() {
      this.logout();
      if (this.$route.path !== "/login") {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style></style>
