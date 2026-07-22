<template>
  <div class="login-container">
    <h1>Login</h1>
    <v-card class="pa-5 mt-4" elevation="4">
      <form @submit.prevent="handleLogin">
        <v-text-field
          label="Username"
          v-model="username"
          :disabled="isLockedOut"
        />
        <v-text-field
          label="Password"
          type="password"
          v-model="password"
          :disabled="isLockedOut"
        />
        <v-btn
          class="mb-2"
          color="primary"
          type="submit"
          block
          :loading="loading"
          :disabled="isLockedOut"
        >
          {{ isLockedOut ? `รอ ${formattedTimeLeft}` : "Login" }}
        </v-btn>
        <v-text>
          Don't have an account?
          <router-link to="/register">Register here</router-link>
        </v-text>
      </form>
    </v-card>

    <v-alert
      v-if="errorMessage && !isLockedOut"
      type="error"
      class="mt-4"
      dense
      outlined
      dismissible
      @input="errorMessage = ''"
    >
      {{ errorMessage }}
    </v-alert>

    <v-alert v-if="isLockedOut" type="error" class="mt-4" dense outlined>
      คุณพยายามเข้าสู่ระบบผิดพลาดเกินจำนวนที่กำหนด<br />
      กรุณาลองใหม่อีกครั้งใน {{ formattedTimeLeft }}
    </v-alert>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      username: "",
      password: "",
      loading: false,
      isLockedOut: false,
      lockTimeLeft: 0,
      timerInterval: null,
      errorMessage: "",
    };
  },
  computed: {
    formattedTimeLeft() {
      const minutes = Math.floor(this.lockTimeLeft / 60);
      const seconds = this.lockTimeLeft % 60;
      return `${minutes} นาที ${seconds} วินาที`;
    },
  },
  methods: {
    ...mapActions(["login"]),
    async handleLogin() {
      this.errorMessage = "";
      if (!this.username || !this.password) {
        this.errorMessage = "กรุณากรอก Username และ Password";
        return;
      }
      this.loading = true;
      try {
        await this.login({
          username: this.username,
          password: this.password,
        });

        Swal.fire({
          title: "สำเร็จ!",
          text: "เข้าสู่ระบบเรียบร้อยแล้ว",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        this.$router.push("/product");
      } catch (err) {
        if (err.response && err.response.status === 429) {
          this.startLockout();
        } else {
          this.errorMessage =
            err.response?.data?.message ||
            "เข้าสู่ระบบไม่สำเร็จ ข้อมูลไม่ถูกต้อง";
        }
      } finally {
        this.loading = false;
      }
    },
    startLockout() {
      this.isLockedOut = true;
      this.lockTimeLeft = 60;
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.lockTimeLeft -= 1;
        if (this.lockTimeLeft <= 0) {
          clearInterval(this.timerInterval);
          this.isLockedOut = false;
        }
      }, 1000);
    },
  },
  beforeDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  },
};
</script>

<style>
.login-container {
  max-width: 450px;
  margin: 0 auto;
  padding: 40px 20px;
}
</style>
