<template>
  <div class="navbar">
    <div class="logo">
      <router-link to="/">
        <img src="../assets/logo.png" alt="Logo" />
      </router-link>
    </div>
    <div class="nav-itm-ctnr">
      <router-link class="nav-itm" to="/pay">Pay</router-link>
      <router-link class="nav-itm" to="/history">History</router-link>
    </div>
    <div class="auth">
      <div v-if="!loggedIn" class="login">Login</div>
      <div v-if="!loggedIn" class="signup">Signup</div>

      <div v-if="loggedIn" class="user">User</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  computed: {
    loggedIn() {
      return this.$store.state.isLoggedIn;
    },
  },
};
</script>

<style lang="scss"></style>
