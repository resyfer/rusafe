<template>
  <Navbar />
  <router-view />
</template>
<script>
import Navbar from "./components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
};
</script>
<style lang="scss">
:root {
  --theme-0-100: #ffffff;
  --theme-1-100: #f5f3f4;
  --theme-2-100: #d3d3d3;
  --theme-3-100: #b1a7a6;
  --theme-4-100: #e5383b;
  --theme-5-100: #ba181b;
  --theme-6-100: #a4161a;
  --theme-7-100: #660708;
  --theme-8-100: #161a1d;
  --theme-9-100: #0b090a;
}
</style>
