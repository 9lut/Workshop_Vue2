<template>
  <div class="pa-6">
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="mb-0">จัดการร้านค้า</h1>
      <v-switch v-model="showInactive" label="แสดงบัญชีที่ถูกระงับ" @change="fetchUsers" hide-details class="mt-0 pt-0"></v-switch>
    </div>

    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="displayShops"
        :loading="loading"
        loading-text="กำลังโหลดข้อมูล..."
        no-data-text="ไม่มีข้อมูลร้านค้า"
      >
        <template v-slot:[`item.isApproved`]="{ item }">
          <v-chip v-if="!item.isActive" color="error" small dark>ถูกระงับ</v-chip>
          <v-chip v-else-if="!item.isApproved" color="warning" small dark>รออนุมัติ</v-chip>
          <v-chip v-else color="success" small dark>อนุมัติแล้ว</v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <div v-if="!item.isActive">
            <v-btn color="success" small @click="restoreShop(item)">
              <v-icon left>mdi-restore</v-icon> กู้คืน
            </v-btn>
          </div>
          <div v-else>
            <v-btn
              color="success"
              small
              class="mr-2"
              @click="approveShop(item)"
            >
              อนุมัติ
            </v-btn>
            <v-btn
              color="error"
              small
              @click="rejectShop(item)"
            >
              ระงับบัญชี
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { getUsers, approveUser, rejectUser } from "@/services/user.service";
import Swal from "sweetalert2";

export default {
  name: "ManageUsers",
  data() {
    return {
      headers: [
        { text: "Username", value: "username" },
        { text: "Role", value: "role" },
        { text: "Status", value: "isApproved" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      users: [],
      loading: false,
      showInactive: false,
    };
  },
  computed: {
    displayShops() {
      if (this.showInactive) {
        return this.users.filter(u => u.role === 'shop' && !u.isActive);
      }
      return this.users.filter(u => u.role === 'shop' && !u.isApproved && u.isActive);
    }
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await getUsers(this.showInactive);
        this.users = response.data.data || [];
      } catch (err) {
        Swal.fire("Error", "ไม่สามารถดึงข้อมูลผู้ใช้งานได้", "error");
      } finally {
        this.loading = false;
      }
    },
    async approveShop(shop) {
      const { isConfirmed } = await Swal.fire({
        title: "ยืนยันการอนุมัติ",
        text: `คุณต้องการอนุมัติร้านค้า ${shop.username} ใช่หรือไม่?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ใช่, อนุมัติ",
        cancelButtonText: "ยกเลิก",
      });

      if (isConfirmed) {
        try {
          await approveUser(shop._id);
          Swal.fire("สำเร็จ", "อนุมัติร้านค้าเรียบร้อยแล้ว", "success");
          this.fetchUsers(); // Refresh the list
        } catch (err) {
          Swal.fire("ล้มเหลว", "เกิดข้อผิดพลาดในการอนุมัติ", "error");
        }
      }
    },
    async rejectShop(shop) {
      const { isConfirmed } = await Swal.fire({
        title: "ยืนยันการระงับบัญชี",
        text: `คุณต้องการปฏิเสธคำขอและระงับบัญชีร้านค้า ${shop.username} ใช่หรือไม่?`,
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "ใช่, ระงับบัญชี",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#d33",
      });

      if (isConfirmed) {
        try {
          await rejectUser(shop._id);
          Swal.fire("สำเร็จ", "ระงับบัญชีร้านค้าเรียบร้อยแล้ว", "success");
          this.fetchUsers(); // Refresh the list
        } catch (err) {
          Swal.fire("ล้มเหลว", "เกิดข้อผิดพลาดในการระงับบัญชี", "error");
        }
      }
    },
    async restoreShop(shop) {
      const { isConfirmed } = await Swal.fire({
        title: "ยืนยันการกู้คืนบัญชี",
        text: `คุณต้องการกู้คืนบัญชีร้านค้า ${shop.username} ให้กลับมาใช้งานได้ปกติใช่หรือไม่?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4CAF50",
        cancelButtonColor: "#9e9e9e",
        confirmButtonText: "ใช่, กู้คืน",
        cancelButtonText: "ยกเลิก"
      });

      if (isConfirmed) {
        try {
          const { restoreUser } = require("@/services/user.service");
          await restoreUser(shop._id);
          Swal.fire("สำเร็จ", "กู้คืนบัญชีร้านค้าเรียบร้อยแล้ว", "success");
          this.fetchUsers(); // Refresh the list
        } catch (err) {
          Swal.fire("ล้มเหลว", "เกิดข้อผิดพลาดในการกู้คืนบัญชี", "error");
        }
      }
    }
  },
};
</script>

<style scoped>
</style>
