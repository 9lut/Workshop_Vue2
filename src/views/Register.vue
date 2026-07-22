<template>
  <div class="register-container">
    <h1>Register</h1>

    <v-card class="pa-5 mt-4" elevation="4">
      <form @submit.prevent="handleRegister">
        <v-text-field
          label="Username"
          v-model="form.username"
          :rules="[v => !!v || 'Username is required']"
          required
        ></v-text-field>

        <v-text-field
          label="Password"
          type="password"
          v-model="form.password"
          :rules="[v => !!v || 'Password is required']"
          required
        ></v-text-field>

        <v-select
          label="สมัครในฐานะ (Role)"
          :items="roles"
          item-text="text"
          item-value="value"
          v-model="form.role"
          required
        ></v-select>

        <v-btn
          color="primary"
          type="submit"
          block
          class="mt-4"
          :loading="loading"
        >
          Register
        </v-btn>
      </form>
    </v-card>

    <v-alert
      v-if="errorMessage"
      type="error"
      class="mt-4"
      dense
      outlined
      dismissible
      @input="errorMessage = ''"
    >
      {{ errorMessage }}
    </v-alert>
  </div>
</template>

<script>
import { register } from "@/services/auth.service";
import Swal from "sweetalert2";

export default {
  name: "Register",
  data() {
    return {
      form: {
        username: "",
        password: "",
        role: "user",
      },
      roles: [
        { text: "ผู้ใช้งานทั่วไป (User)", value: "user" },
        { text: "ร้านค้า (Shop)", value: "shop" },
      ],
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleRegister() {
      this.errorMessage = "";
      if (!this.form.username || !this.form.password) {
        this.errorMessage = "กรุณากรอกข้อมูลให้ครบถ้วน";
        return;
      }

      this.loading = true;
      try {
        await register(this.form);
        
        let successMessage = "สมัครสมาชิกสำเร็จ!";
        if (this.form.role === "shop") {
          successMessage = "สมัครสมาชิกร้านค้าสำเร็จ! กรุณารอแอดมินอนุมัติก่อนเข้าสู่ระบบ";
        }

        Swal.fire({
          title: "สำเร็จ!",
          text: successMessage,
          icon: "success",
          confirmButtonText: "ไปที่หน้าเข้าสู่ระบบ",
        }).then(() => {
          this.$router.push("/login");
        });
      } catch (err) {
        this.errorMessage =
          err.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ โปรดลองอีกครั้ง";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  max-width: 450px;
  margin: 0 auto;
  padding: 40px 20px;
}
</style>
