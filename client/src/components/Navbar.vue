<template>
  <div class="navbar">
    <div class="logo">
      <router-link to="/profile">
        <img src="../assets/logo.png" alt="Logo" />
      </router-link>
    </div>
    <div class="nav-itm-ctnr">
      <router-link class="nav-itm" to="/profile">Home</router-link>
      <router-link class="nav-itm" to="/pay">Pay</router-link>
      <router-link class="nav-itm" to="/history">History</router-link>
    </div>
    <div class="logout nav-itm" @click="logOut">Logout</div>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  name: "Navbar",
  setup() {
    const store = useStore();

    return {
      logOut: () => store.commit("userLoggedOut"),
    };
  },
};
</script>

<style lang="scss">
.navbar {
  background-color: var(--theme-9-100);
  color: var(--theme-0-100);

  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 8vh;
  width: 100%;
  padding: 0 4vh;

  .logo {
    height: 70%;

    img {
      height: 100%;
    }
  }

  .nav-itm-ctnr {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .nav-itm {
    margin-right: 1vh;
    padding: 1.25vh 4vh;
    text-decoration: none;
    border-radius: 0.5vh;
    color: var(--theme-0-100);
    font-size: 2.4vh;
    cursor: pointer;

    &:hover {
      background-color: var(--theme-4-100);
      color: var(--theme-9-100);

      transition: 0.2s ease-in-out;
    }
  }
}
</style>
