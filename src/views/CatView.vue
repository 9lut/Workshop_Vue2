<template>
  <v-container>
    <v-btn color="success" @click="show = !show" class="mb-4">
      {{ show ? "Hide Cards" : "Show Cards" }}
    </v-btn>
    <v-row v-if="show">
      <v-col
        v-for="item in cards"
        :key="item.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <CardImg :card="item" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CardImg from "@/components/CardImg.vue";

export default {
  components: {
    CardImg,
  },

  data() {
    return {
      cards: [
        {
          id: 1,
          title: "แมวตัวที่ 1",
          image:
            "https://thonglorpet.com/_content_images/petdiary/S0386.jpg?vs=20250723155134",
          description: "รายละเอียดของแมวตัวที่ 1",
        },
        {
          id: 2,
          title: "แมวตัวที่ 2",
          image:
            "https://thonglorpet.com/_content_images/petdiary/S0424.jpg.webp?vs=20250804154958",
          description: "รายละเอียดของแมวตัวที่ 2",
        },
        {
          id: 3,
          title: "แมวตัวที่ 3",
          image:
            "https://s.isanook.com/wo/0/ud/46/233137/c.jpg?ip/crop/w670h402/q80/jpg",
          description: "รายละเอียดของแมวตัวที่ 3",
        },
        {
          id: 4,
          title: "แมวตัวที่ 4",
          image:
            "https://www.sarakadee.com/blog/oneton/wp-content/uploads/2017/12/cat-cute-e1533862828469.jpg",
          description: "รายละเอียดของแมวตัวที่ 4",
        },
      ],
      show: true,
    };
  },
};
</script>
