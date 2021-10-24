<template>
  <div class="forgot-password">
    <div class="title">Forgot Password</div>

    <div class="error" v-if="authDetails.error">{{ authDetails.error }}</div>
    <form>
      <input
        type="text"
        placeholder="Username / Email"
        v-model.trim="credentials.identifier"
      />
      <button
        type="submit"
        @click.prevent="
          generateString({
            identifier: credentials.identifier,
          })
        "
      >
        Forgot Password
      </button>
    </form>
    <router-link
      v-if="authDetails.error === 'Verify OTP first'"
      class="forgot-password-help"
      v-bind:to="`/otp-verify/${credentials.identifier}`"
    >
      Verify OTP
    </router-link>
  </div>
</template>

<script>
import { reactive, watch } from "vue";
import { useMutation } from "@vue/apollo-composable";
import Cookies from "js-cookie";
import gql from "graphql-tag";
import router from "../router";

export default {
  name: "ForgotPassword",
  setup() {
    document.title = "Forgot Password | Rusafe";

    // Get JWT
    if (Cookies.get("jwt")) {
      router.push("/profile");
    }

    const credentials = reactive({
      identifier: "",
    });

    const authDetails = reactive({
      error: "",
    });

    watch(authDetails, () => {
      if (authDetails.error == null) {
        router.push(`/auth-verify/${credentials.identifier}`);
      }
    });

    const { mutate: generateString } = useMutation(
      gql`
        mutation generate($identifier: String!) {
          generateString(identifier: $identifier) {
            error
          }
        }
      `,
      {
        update(_cache, result) {
          authDetails.error = result.data.generateString.error;
        },
      }
    );

    return {
      credentials,
      authDetails,
      generateString,
    };
  },
};
</script>

<style lang="scss">
div.forgot-password {
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

  div.error {
    color: red;
    width: calc(40% * 80 / 100);
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
    padding: 3vh 0;
    width: 40%;
    height: 30vh;

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
    }
  }

  .forgot-password-help {
    color: var(--theme-0-100);
    margin-top: 3vh;
    margin-bottom: 3vh;
  }
}
</style>
