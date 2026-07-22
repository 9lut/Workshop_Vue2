<template>
  <v-container class="py-8 min-vh-100">
    <h1 class="text-h4 font-weight-black text-grey-darken-4 mb-6">
      ประวัติการสั่งซื้อ (My Orders)
    </h1>

    <v-card class="rounded-xl elevation-2">
      <v-card-text v-if="orders.length === 0" class="text-center py-10">
        <v-icon size="80" color="grey lighten-1">mdi-receipt-text</v-icon>
        <h2 class="text-h5 font-weight-bold grey--text text--darken-1 mt-4">
          ยังไม่มีประวัติการสั่งซื้อ
        </h2>
        <p class="grey--text mt-2">
          คุณยังไม่เคยสั่งซื้อสินค้าใดๆ กลับไปช้อปปิ้งกันเถอะ!
        </p>
        <v-btn
          color="orange"
          rounded
          class="mt-4 px-8 text-white font-weight-bold"
          :to="{ name: 'product' }"
        >
          เริ่มช้อปเลย
        </v-btn>
      </v-card-text>

      <v-data-table
        v-else
        :headers="headers"
        :items="orders"
        :loading="loading"
        class="elevation-0"
        sort-by="purchasedAt"
        sort-desc
      >
        <template v-slot:[`item.purchasedAt`]="{ item }">
          {{ formatDate(item.purchasedAt) }}
        </template>

        <template v-slot:[`item.totalPrice`]="{ item }">
          <span class="font-weight-bold orange--text text--darken-2"
            >฿{{ formatPrice(item.totalPrice) }}</span
          >
        </template>

        <template v-slot:[`item.productDetails.name`]="{ item }">
          <div v-if="item.productDetails">{{ item.productDetails.name }}</div>
          <div v-else class="grey--text">สินค้านี้ไม่พร้อมจำหน่ายแล้ว</div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small color="primary" outlined @click="viewReceipt(item)">
            <v-icon left>mdi-file-document-outline</v-icon> ดูใบเสร็จ
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Receipt Dialog -->
    <v-dialog v-model="receiptDialog" max-width="450">
      <v-card class="rounded-lg" id="receipt-card">
        <v-card-text
          class="pa-6 text-center black--text"
          id="printable-receipt"
        >
          <div
            class="d-flex flex-column align-center justify-center text-center mb-4"
          >
            <v-img
              alt="EasyShop Logo"
              src="/LOGO2.png"
              contain
              width="75"
              class="receipt-logo mb-3"
            />

            <h2
              class="font-weight-black text-h5 grey--text text--darken-4 mb-1"
            >
              EasyShop
            </h2>

            <div class="text-caption grey--text text--darken-1 text-uppercase">
              ใบเสร็จรับเงิน
            </div>
          </div>

          <v-divider class="my-3 border-dashed"></v-divider>

          <div class="d-flex justify-space-between text-caption mb-1">
            <span class="font-weight-bold">รหัสการสั่งซื้อ (Order ID):</span>
            <span>{{ selectedOrder?.orderId }}</span>
          </div>
          <div class="d-flex justify-space-between text-caption mb-3">
            <span class="font-weight-bold">วันที่ (Date):</span>
            <span>{{ formatDate(selectedOrder?.purchasedAt) }}</span>
          </div>

          <v-divider class="my-3 border-dashed"></v-divider>

          <div class="text-left font-weight-bold mb-2">
            รายการสินค้า (Items)
          </div>
          <div class="d-flex justify-space-between text-body-2 mb-1">
            <span>{{
              selectedOrder?.productDetails?.name || "สินค้า (ไม่มีชื่อ)"
            }}</span>
            <span
              >฿{{
                formatPrice(selectedOrder?.productDetails?.pricePerUnit || 0)
              }}</span
            >
          </div>
          <div
            class="d-flex justify-space-between text-caption grey--text mb-3"
          >
            <span>จำนวน (Qty): {{ selectedOrder?.orderedQuantity }}</span>
          </div>

          <v-divider class="my-3 border-dashed"></v-divider>

          <div class="d-flex justify-space-between align-end mb-2">
            <span class="font-weight-bold text-h6">ยอดชำระสุทธิ (Total)</span>
            <span class="font-weight-bold text-h5 orange--text text--darken-3"
              >฿{{ formatPrice(selectedOrder?.totalPrice || 0) }}</span
            >
          </div>
          <div class="d-flex justify-space-between text-caption mt-1">
            <span class="font-weight-bold">สถานะ (Status):</span>
            <span class="success--text font-weight-bold">ชำระแล้ว (Paid)</span>
          </div>

          <v-divider class="my-4 border-dashed"></v-divider>

          <div class="text-caption grey--text text-center">
            ขอบคุณที่ใช้บริการ EasyShop<br />
            Thank you for shopping with us!
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 bg-grey-lighten-4 d-print-none">
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="receiptDialog = false"
            >ปิด</v-btn
          >
          <v-btn color="primary" depressed @click="printReceipt">
            <v-icon left>mdi-printer</v-icon> พิมพ์ใบเสร็จ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { getMyOrders } from "@/services/order.service";
import Swal from "sweetalert2";

export default {
  name: "MyOrders",
  data() {
    return {
      orders: [],
      loading: false,
      receiptDialog: false,
      selectedOrder: null,
      headers: [
        { text: "รหัสออเดอร์", value: "orderId", sortable: false },
        { text: "วันที่สั่งซื้อ", value: "purchasedAt" },
        { text: "สินค้า", value: "productDetails.name" },
        { text: "จำนวน", value: "orderedQuantity", align: "center" },
        { text: "ยอดรวม", value: "totalPrice", align: "right" },
        { text: "ใบเสร็จ", value: "actions", sortable: false, align: "center" },
      ],
    };
  },
  async mounted() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const response = await getMyOrders();
        this.orders = response.data.data;
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "โหลดประวัติการสั่งซื้อล้มเหลว", "error");
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat("th-TH").format(price);
    },
    formatDate(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      return date.toLocaleString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    viewReceipt(order) {
      this.selectedOrder = order;
      this.receiptDialog = true;
    },
    printReceipt() {
      window.print();
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
.border-dashed {
  border-style: dashed !important;
  border-width: 1px !important;
  border-color: #bdbdbd !important;
}

@media print {
  body * {
    visibility: hidden;
  }
  .v-dialog {
    box-shadow: none !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  #receipt-card,
  #receipt-card * {
    visibility: visible;
  }
  #receipt-card {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    box-shadow: none !important;
  }
  .d-print-none {
    display: none !important;
  }
}

.receipt-logo {
  filter: grayscale(100%) brightness(0);
  opacity: 0.9;
}

.text-uppercase {
  letter-spacing: 2px;
  text-transform: uppercase;
}
</style>
