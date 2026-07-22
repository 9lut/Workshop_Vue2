<template>
  <v-card>
    <v-img :src="card.image" height="220" cover />
    <v-card-title>
      {{ card.title }}
    </v-card-title>
    <v-card-text>
      {{ card.description }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
};
</script>