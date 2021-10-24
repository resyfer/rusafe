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
    <div class="avatar" v-if="store.state.user">
      <img v-bind:src="store.state.user.img" v-bind:alt="store.state.user" />
      <div class="name">{{ store.state.user.username }}</div>
      <div class="dropdown">
        <div class="logout" @click="logOut">Logout</div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import Cookies from "js-cookie";
import router from "../router/index";

export default {
  name: "Navbar",
  setup() {
    const store = useStore();

    const logOut = () => {
      store.commit("userLoggedOut");
      Cookies.set("jwt", "", { expires: 0 });
      router.push("/");
    };

    return {
      logOut,
      store,
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

  height: 8.5vh;
  width: 100%;
  padding: 0 7vh;

  .logo {
    height: 60%;

    img {
      height: 100%;
    }
  }

  .nav-itm-ctnr {
    display: flex;
    flex-direction: row;
    align-items: center;

    .nav-itm {
      margin-right: 1vh;
      padding: 1.25vh 4vh;
      text-decoration: none;
      border-radius: 0.5vh;
      color: var(--theme-0-100);
      font-size: 2.3vh;
      cursor: pointer;

      &:hover {
        color: var(--theme-4-100);
        transition: 0.2s ease-in-out;
      }
    }
  }

  .avatar {
    position: relative;
    height: 90%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 2vh;
    border-radius: 0.75vh;

    border: 0.2vh solid var(--theme-5-100);
    color: var(--theme-5-100);
    cursor: default;

    &:hover {
      color: var(--theme-9-100);
      background-color: var(--theme-5-100);
      transition: 0.2s ease-in-out;

      .dropdown {
        display: block;
        transition: 0.2s ease-in-out;
      }
    }

    img {
      height: 75%;
      border-radius: 50%;
      margin-right: 1vw;
    }

    .dropdown {
      position: absolute;
      background-color: var(--theme-8-100);
      color: var(--theme-4-100);
      top: 100%;
      left: 50%;
      transform: translate(-50%, 0);
      width: 100%;
      text-align: center;
      padding: 2vh;
      display: none;
      border-radius: 0 0 1vh 1vh;
      cursor: pointer;
    }
  }
}
</style>
