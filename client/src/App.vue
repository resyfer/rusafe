<template>
  <router-view />
</template>

<script>
import { watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import Cookies from "js-cookie";
import { useStore } from "vuex";
import router from "./router/index";
import gql from "graphql-tag";

export default {
  name: "App",
  setup() {
    const store = useStore();
    const token = Cookies.get("jwt");

    if (token) {
      const { result } = useQuery(
        gql`
          query($jwt: String!) {
            user(jwt: $jwt) {
              _id
              name
              username
              img
              balance
              phone
              error
            }
          }
        `,
        {
          jwt: token,
        }
      );

      watch(result, () => {
        if (!result.value.user.error) {
          console.log(result.value);
          store.commit("userLoggedIn", result.value.user);
          router.push("/profile");
        } else {
          router.push("/");
        }
      });
    } else {
      router.push("/");
    }
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Nunito&display=swap");

* {
  margin: 0;
  padding: 0;
  font-family: "Nunito", sans-serif;
  box-sizing: border-box;
}

:root {
  --theme-0-100: #ffffff;
  --theme-1-100: #f5f3f4;
  --theme-2-100: #d3d3d3;
  --theme-3-100: #b1a7a6;
  --theme-4-100: #e5383b;
  --theme-5-100: #ba181b;
  --theme-5-000: #ba181b00;
  --theme-6-100: #a4161a;
  --theme-7-100: #660708;
  --theme-7-040: rgba(102, 7, 9, 0.4);
  --theme-8-100: #1d1818;
  --theme-9-100: #0b090a;
}
</style>
