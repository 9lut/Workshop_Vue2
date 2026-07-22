<template>
  <v-container>
    <h1 class="mb-4">API Tester</h1>

    <!-- URL -->
    <v-text-field v-model="url" label="API URL" outlined />

    <!-- Method -->
    <v-select
      v-model="method"
      :items="['GET']"
      label="Method"
      outlined
    />

    <!-- Body -->
    <v-textarea
      v-if="method !== 'GET'"
      v-model="body"
      label="JSON Body"
      rows="8"
      outlined
    />

    <v-btn color="primary" class="mr-2" :loading="loading" @click="sendRequest">
      Send Request
    </v-btn>

    <v-btn color="error" outlined @click="clear"> Clear </v-btn>

    <v-alert v-if="error" type="error" class="mt-4">
      {{ error }}
    </v-alert>

    <v-card v-if="response" class="mt-5 pa-4" outlined>
      <h3>Response</h3>

      <pre>{{ prettyJson }}</pre>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      url: "http://localhost:3005/api/v1/products",
      method: "GET",
      body: `{
}`,
      loading: false,
      response: null,
      error: null,
    };
  },

  computed: {
    prettyJson() {
      return JSON.stringify(this.response, null, 2);
    },
  },

  methods: {
    async sendRequest() {
      this.loading = true;
      this.error = null;
      this.response = null;

      try {
        let res;

        if (this.method === "GET") {
          res = await axios.get(this.url, {
            withCredentials: true,
          });
        } else {
          res = await axios({
            method: this.method.toLowerCase(),
            url: this.url,
            data: JSON.parse(this.body),
            withCredentials: true,
          });
        }

        this.response = res.data;
      } catch (err) {
        this.error = err.response?.data || err.message;
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.response = null;
      this.error = null;
    },
  },
};
</script>

<style scoped>
pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  white-space: pre-wrap;
  overflow-x: auto;
}
</style>