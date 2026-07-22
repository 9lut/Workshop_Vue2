import Vue from "vue";
import Vuex from "vuex";
import { login } from "@/services/auth.service";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user")) || null,
    cart: JSON.parse(localStorage.getItem("cart")) || [],
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    cartCount: (state) =>
      state.cart.reduce((total, item) => total + item.quantity, 0),
    getCart: (state) => state.cart,
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    LOGOUT(state) {
      state.token = "";
      state.user = null;
      state.cart = [];
      localStorage.removeItem("cart");
    },
    ADD_TO_CART(state, product) {
      const existingItem = state.cart.find((item) => item._id === product._id);
      const qtyToAdd = product.selectedQuantity || 1;
      if (existingItem) {
        existingItem.quantity += qtyToAdd;
      } else {
        const itemToAdd = { ...product };
        delete itemToAdd.selectedQuantity;
        itemToAdd.quantity = qtyToAdd;
        state.cart.push(itemToAdd);
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    UPDATE_CART_QUANTITY(state, { productId, quantity }) {
      const item = state.cart.find((item) => item._id === productId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter((item) => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    CLEAR_CART(state) {
      state.cart = [];
      localStorage.removeItem("cart");
    },
  },
  actions: {
    async login({ commit }, payload) {
      const response = await login(payload);
      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      commit("SET_TOKEN", token);
      commit("SET_USER", user);

      return response;
    },
    logout({ commit }) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      commit("LOGOUT");
    },
    addToCart({ commit, state }, product) {
      const existingItem = state.cart.find((item) => item._id === product._id);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const qtyToAdd = product.selectedQuantity || 1;

      if (currentQuantity + qtyToAdd > product.stock) {
        return {
          success: false,
          message: `สินค้านี้มีในสต๊อกแค่ ${product.stock} ชิ้น (คุณมีในตะกร้าแล้ว ${currentQuantity} ชิ้น)`,
        };
      }

      commit("ADD_TO_CART", product);
      return {
        success: true,
        message: `เพิ่ม ${product.name} จำนวน ${qtyToAdd} ชิ้น ลงตะกร้าแล้ว!`,
      };
    },
    updateCartQuantity({ commit }, payload) {
      commit("UPDATE_CART_QUANTITY", payload);
    },
    removeFromCart({ commit }, productId) {
      commit("REMOVE_FROM_CART", productId);
    },
    clearCart({ commit }) {
      commit("CLEAR_CART");
    },
  },
  modules: {},
});
