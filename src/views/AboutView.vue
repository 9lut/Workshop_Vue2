<template>
  <v-container fluid class="hero">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" md="5" class="text-center">
        <v-avatar size="220" class="mb-5 elevation-10">
          <v-img src="https://inwfile.com/s-j/f5oy1w.jpg" cover />
        </v-avatar>
      </v-col>

      <v-col cols="12" md="6">
        <h1 class="text-h2 font-weight-bold mb-3">Hello 👋</h1>
        <h2 class="text-h4 text-primary mb-2">I'm Lutfee Dorloh</h2>
        <p class="text-subtitle-1 text-primary mb-2">ชื่อเล่น : ลุต</p>
        <p class="text-body-1 text-grey-darken-1">
          จบมาจากคณะวิศวกรรมศาสตร์ สาขาวิศวกรรมคอมพิวเตอร์
          มหาวิทยาลัยสงขลานครินทร์
        </p>
        <div class="mb-2">
          <v-chip class="ma-1" color="primary"> Vue.js </v-chip>
          <v-chip class="ma-1" color="success"> Node.js </v-chip>
          <v-chip class="ma-1" color="orange"> Express </v-chip>
          <v-chip class="ma-1" color="deep-purple"> MySQL </v-chip>
          <v-chip class="ma-1" color="pink"> Docker </v-chip>
        </div>
      </v-col>
    </v-row>

    <!-- About -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-5 h-100">
          <h2 class="text-h5 mb-4">🎮 งานอดิเรก</h2>
          <ul>
            <li>เขียนโปรแกรม</li>
            <li>ดูหนัง</li>
            <li>เล่นเกม</li>
            <li>ตัดต่อวิดีโอ</li>
          </ul>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-5 h-100">
          <h2 class="text-h5 mb-4">❤️ สิ่งที่ชอบ</h2>
          <ul>
            <li>เทคโนโลยี</li>
            <li>การเงิน</li>
            <li>หุ้น</li>
            <li>แมว</li>
          </ul>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-5 h-100">
          <h2 class="text-h5 mb-4">❌ สิ่งที่ไม่ชอบ</h2>
          <ul>
            <li>ทำงานในสภาพแวดล้อมที่ไม่สะดวก</li>
            <li>อินเทอร์เน็ตช้า</li>
            <li>งานที่ไม่มีการวางแผน</li>
            <li>ฝนตก กลัวเปียก</li>
          </ul>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AboutMe",
};
</script>

<style scoped>
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #eef6ff 0%, #ffffff 45%, #e3f2fd 100%);
  padding: 60px;
}

h1,
h2 {
  line-height: 1.2;
}

.v-avatar {
  border: 6px solid white;
}
</style>