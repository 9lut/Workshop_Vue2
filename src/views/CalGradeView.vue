<template>
  <div class="cal-container cal-card">
    <h1>Grade Calculator</h1>
    <form @submit.prevent="calculateGrade">
      <!-- <label>Score</label> -->
      <v-text-field
        v-model.number="score"
        type="number"
        label="Score"
        :max="100"
        :min="0"
        length="3"
        :rules="[
          (v) => (v !== null && v !== '') || 'กรุณากรอกคะแนน',
          (v) => v >= 0 || 'คะแนนต้องไม่น้อยกว่า 0',
          (v) => v <= 100 || 'คะแนนต้องไม่เกิน 100',
        ]"
      />
      <v-btn type="submit" color="primary">Calculate</v-btn>
    </form>
    <h2 class="result" v-if="result">Grade : {{ result }}</h2>
    <div class="mt-2">
      <h3>Grade Scale</h3>
      <table class="grade-table">
        <thead>
          <tr>
            <th>Grade</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in gradeScale" :key="item.grade">
            <td>{{ item.grade }}</td>
            <td>{{ item.min }} - {{ item.max }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      score: 1,
      result: "",
      gradeScale: [
        { grade: "A", min: 80, max: 100 },
        { grade: "B", min: 70, max: 79 },
        { grade: "C", min: 60, max: 69 },
        { grade: "D", min: 50, max: 59 },
        { grade: "F", min: 0, max: 49 },
      ],
    };
  },
  methods: {
    calculateGrade() {
      const matchedGrade = this.gradeScale.find(
        ({ min, max }) => this.score >= min && this.score <= max,
      );

      this.result = matchedGrade ? matchedGrade.grade : "";
    },
  },
};
</script>

<style scoped>
.cal-container {
  max-width: 450px;
  margin: 80px auto;
}

.cal-card {
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

h1 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  margin-bottom: 20px;
}

input:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 8px rgba(79, 172, 254, 0.4);
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #4facfe;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #2d8cf0;
}

.result {
  margin-top: 25px;
  text-align: center;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 10px;
}

.result h2 {
  color: #4facfe;
  margin-bottom: 10px;
}

.result p {
  font-size: 26px;
  font-weight: bold;
}

.grade-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.grade-table th,
.grade-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.grade-table th {
  background-color: #4caf50;
  color: white;
}

.grade-table tbody tr:nth-child(even) {
  background-color: #f5f5f5;
}

.grade-table tbody tr:hover {
  background-color: #e8f5e9;
}
</style>
