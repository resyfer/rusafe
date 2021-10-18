<template>
  <Navbar />
  {{ store.state.user }}
</template>

<script>
import { useStore } from "vuex";

import Navbar from "../components/Navbar.vue";

export default {
  name: "Profile",
  components: {
    Navbar,
  },
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
};
</script>
