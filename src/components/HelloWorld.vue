<template>
  <v-container>
    <v-row class="text-center mt-10">
      <v-col cols="12">
        <v-img
          src="https://job.science.cmu.ac.th/upload/company/1-2024-01-24-926040289.png"
          alt="INET Logo"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-2">
        <h1 class="display-2 font-weight-bold mb-2">
          Welcome to <span class="success--text">INET</span>
        </h1>
        <h5 class="font-weight-bold" v-if="user">
          Username : <span class="success--text">{{ user.username }}</span>
        </h5>
        <h5 class="font-weight-bold mb-2" v-if="user">
          Role : <span class="success--text">{{ user.role }}</span>
        </h5>
      </v-col>
      <v-col cols="12">
        <h2 class="text-h5">Menu</h2>
      </v-col>
      <v-col cols="12">
        <v-btn class="mr-4 mb-2" color="primary" :to="{ name: 'about' }">
          About Me
        </v-btn>

        <v-btn class="mr-4 mb-2" color="success" :to="{ name: 'calGrade' }">
          Grade Calculator
        </v-btn>
        <v-btn class="mr-4 mb-2" color="warning" :to="{ name: 'cat' }">
          Cat Cards
        </v-btn>
        <v-btn class="mr-4 mb-2" color="info" :to="{ name: 'product' }">
          <v-icon left>mdi-shopping</v-icon>
          Product View
        </v-btn>
        <v-btn class="mr-4 mb-2" color="secondary" :to="{ name: 'apiTest' }">
          <v-icon left>mdi-api</v-icon>
          API Test
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      user: "getUser" 
    })
  }
};
</script>

