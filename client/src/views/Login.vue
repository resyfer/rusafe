<template>
  <div class="login">
    <div class="title">Login</div>
    <div class="login-form">
      <div class="error" v-if="authData.error">{{ authData.error }}</div>
      <form>
        <input
          type="text"
          placeholder="Username / Email*"
          v-model="credentials.identifier"
        />
        <input
          type="password"
          placeholder="Password*"
          v-model="credentials.password"
        />
        <button
          type="submit"
          v-bind="{ disabled: !validLogin }"
          @click.prevent="
            login({
              identifier: credentials.identifier,
              password: credentials.password,
            })
          "
        >
          Submit
        </button>
      </form>
      <router-link class="sign-up login-links" to="/signup">
        New here? Sign Up
      </router-link>
      <router-link class="forgot-password login-links" to="/forgot-password">
        Forgot Password?
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { useStore } from "vuex";
import router from "../router/index";
import gql from "graphql-tag";
import Cookies from "js-cookie";

const passwordValid = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$/;
export default {
  name: "Login",
  setup() {
    // Page Title
    document.title = "Login | Rusafe";

    const store = useStore();

    // Get JWT
    if (Cookies.get("jwt")) {
      router.push("/profile");
    }

    // Form Data
    const credentials = reactive({
      identifier: "",
      password: "",
    });

    const validLogin = computed(() => {
      return (
        credentials.identifier !== "" &&
        passwordValid.test(credentials.password)
      );
    });

    // Login
    let authData = ref({
      jwt: null,
      error: null,
    });

    const { mutate: login } = useMutation(
      gql`
        mutation login($identifier: String!, $password: String!) {
          login(identifier: $identifier, password: $password) {
            jwt
            user {
              _id
              name
              username
              img
              balance
              phone
            }
            error
          }
        }
      `,
      {
        update: (_cache, result) => {
          if (result.data.login.error) {
            authData.value.error = result.data.login.error;
            return;
          }

          if (result.data.login.jwt) {
            Cookies.set("jwt", result.data.login.jwt, { expires: 365 });
            store.commit("userLoggedIn", result.data.login.user);
            router.push("/profile");
          }

          authData.value = result.data.login;
        },
      }
    );

    return {
      credentials,
      login,
      validLogin,
      authData,
    };
  },
};
</script>

<style lang="scss">
div.login {
  background-color: var(--theme-8-100);
  height: 100vh;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  div.title {
    font-size: 3.5vh;
    margin-bottom: 5vh;
    color: var(--theme-1-100);
    text-transform: uppercase;
  }

  div.login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3vh;
    width: 40%;
    height: 40vh;

    border-radius: 1.5vh;

    div.error {
      color: red;
      width: 80%;
      padding: 2vh 3vh;
      border-radius: 1vh;
      margin-bottom: 5vh;
      border: 0.2vh solid var(--theme-4-100);
      background-color: var(--theme-7-040);
      font-size: 2.4vh;
    }

    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;

      input {
        outline: none;
        height: 7vh;
        width: 80%;
        border-radius: 1vh;
        padding-left: 3vh;
        font-size: 2.5vh;

        margin-bottom: 2.5vh;

        background-color: var(--theme-8-100);
        border: 0.3vh solid var(--theme-7-100);
        color: var(--theme-2-100);
      }

      button[type="submit"] {
        outline: none;
        text-decoration: none;
        padding: 2vh 5vh;
        margin-top: 3vh;
        margin-bottom: 2vh;
        border-radius: 0.75vh;
        text-transform: uppercase;
        cursor: pointer;
        border: 0.2vh solid var(--theme-5-000);
        background-color: var(--theme-5-100);
        color: var(--theme-2-100);

        &:hover {
          border: 0.2vh solid var(--theme-5-100);
          background-color: var(--theme-8-100);
          color: var(--theme-5-100);
          transition: 0.2s ease-in-out;
        }

        &:disabled {
          background-color: var(--theme-3-100);
          color: var(--theme-9-100);
          border: 0.2vh solid var(--theme-9-000);
          cursor: not-allowed;

          &:hover {
            background-color: var(--theme-3-100);
            color: var(--theme-9-100);
          }
        }
      }
    }

    .login-links {
      color: var(--theme-0-100);
      margin-top: 1vh;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
