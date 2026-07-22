<template>
  <v-container class="py-8 min-vh-100">
    <h1 class="text-h4 font-weight-black text-grey-darken-4 mb-6">ยอดขายและการสั่งซื้อ (Manage Orders)</h1>

    <!-- Dashboard Summary Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="rounded-xl pa-5 elevation-2" color="orange" dark>
          <div class="d-flex align-center">
            <v-avatar color="white" size="64" class="mr-4">
              <v-icon color="orange" size="32">mdi-cash-multiple</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-medium">ยอดขายรวม (Total Revenue)</div>
              <div class="text-h4 font-weight-black">฿{{ formatPrice(totalRevenue) }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="rounded-xl pa-5 elevation-2" color="blue" dark>
          <div class="d-flex align-center">
            <v-avatar color="white" size="64" class="mr-4">
              <v-icon color="blue" size="32">mdi-cart-check</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-medium">จำนวนคำสั่งซื้อ (Total Orders)</div>
              <div class="text-h4 font-weight-black">{{ orders.length }} ออเดอร์</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Chart Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="rounded-xl elevation-2 pa-4">
          <v-card-title class="font-weight-bold pb-0">กราฟสรุปยอดขายรายวัน</v-card-title>
          <v-card-text>
            <div v-if="orders.length === 0 && !loading" class="text-center py-10 grey--text">
              ไม่มีข้อมูลยอดขาย
            </div>
            <apexchart v-else type="area" height="350" :options="chartOptions" :series="chartSeries"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Orders Table -->
    <v-card class="rounded-xl elevation-2">
      <v-card-title class="font-weight-bold border-b pa-4">
        รายการสั่งซื้อล่าสุด
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="ค้นหาข้อมูล"
          single-line
          hide-details
          outlined
          dense
          style="max-width: 300px;"
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="orders"
        :search="search"
        :loading="loading"
        class="elevation-0"
        sort-by="purchasedAt"
        sort-desc
      >
        <template v-slot:[`item.purchasedAt`]="{ item }">
          {{ formatDate(item.purchasedAt) }}
        </template>
        
        <template v-slot:[`item.totalPrice`]="{ item }">
          <span class="font-weight-bold green--text text--darken-2">฿{{ formatPrice(item.totalPrice) }}</span>
        </template>

        <template v-slot:[`item.productDetails.name`]="{ item }">
          <div v-if="item.productDetails">{{ item.productDetails.name }}</div>
          <div v-else class="grey--text">สินค้าถูกลบ</div>
        </template>

        <template v-slot:[`item.buyer.username`]="{ item }">
           <v-chip small color="grey lighten-2" class="font-weight-bold">
             <v-icon left size="16">mdi-account</v-icon>
             {{ item.buyer ? item.buyer.username : 'ไม่ระบุ' }}
           </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { getOrders } from "@/services/manage.service";
import Swal from "sweetalert2";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "ManageOrders",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      orders: [],
      loading: false,
      search: "",
      headers: [
        { text: "รหัสออเดอร์", value: "orderId", sortable: false },
        { text: "วันที่สั่งซื้อ", value: "purchasedAt" },
        { text: "ผู้ซื้อ", value: "buyer.username" },
        { text: "สินค้า", value: "productDetails.name" },
        { text: "จำนวน", value: "orderedQuantity", align: "center" },
        { text: "ยอดรวม", value: "totalPrice", align: "right" },
      ],
    };
  },
  computed: {
    totalRevenue() {
      return this.orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    },
    salesData() {
      const grouped = {};
      this.orders.forEach(order => {
        const date = new Date(order.purchasedAt).toISOString().split('T')[0];
        if (!grouped[date]) grouped[date] = 0;
        grouped[date] += (order.totalPrice || 0);
      });
      const sortedDates = Object.keys(grouped).sort();
      return {
        categories: sortedDates,
        data: sortedDates.map(date => grouped[date])
      };
    },
    chartOptions() {
      return {
        chart: {
          id: 'sales-chart',
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        xaxis: {
          categories: this.salesData.categories,
          labels: {
            formatter: function (value) {
              if(!value) return '';
              const date = new Date(value);
              return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
            }
          }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        colors: ['#f97316'],
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 90, 100]
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "฿" + new Intl.NumberFormat("th-TH").format(val)
            }
          }
        }
      }
    },
    chartSeries() {
      return [{
        name: 'ยอดขาย',
        data: this.salesData.data
      }]
    }
  },
  async mounted() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const response = await getOrders();
        this.orders = response.data.data;
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "ไม่สามารถดึงข้อมูลออเดอร์ได้ อาจเป็นเพราะสิทธิ์การเข้าถึง", "error");
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
      return date.toLocaleString('th-TH', { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      });
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
</style>
