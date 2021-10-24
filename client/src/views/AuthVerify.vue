<template>
  <div class="auth-verify">
    <div class="title">New Password</div>

    <div class="error" v-if="authDetails.error">{{ authDetails.error }}</div>
    <form>
      <input
        type="text"
        placeholder="Auth String*"
        v-model.trim="credentials.authString"
      />
      <input
        type="password"
        placeholder="New Password*"
        v-model="credentials.newPassword"
      />
      <button
        type="submit"
        v-bind="{ disabled: !validForm }"
        @click.prevent="
          newPassword({
            identifier: credentials.identifier,
            authString: credentials.authString,
            newPassword: credentials.newPassword,
          })
        "
      >
        New Password
      </button>
    </form>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import Cookies from "js-cookie";
import gql from "graphql-tag";
import router from "../router";

const passwordValid = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$/;

export default {
  name: "AuthVerify",
  setup() {
    const route = useRoute();

    document.title = "New Password | Rusafe";

    // Get JWT
    if (Cookies.get("jwt")) {
      router.push("/profile");
    }

    const credentials = reactive({
      identifier: route.params.identifier,
      authString: "",
      newPassword: "",
    });

    const authDetails = reactive({
      error: null,
    });

    const { mutate: newPassword } = useMutation(
      gql`
        mutation newPassword(
          $identifier: String!
          $authString: String!
          $newPassword: String!
        ) {
          forgotPassword(
            identifier: $identifier
            authString: $authString
            newPassword: $newPassword
          ) {
            error
            jwt
          }
        }
      `,
      {
        update(_cache, result) {
          if (result.data.forgotPassword.error) {
            authDetails.error = result.data.forgotPassword.error;
            return;
          }

          Cookies.set("jwt", result.data.forgotPassword.jwt, { expires: 365 });
          location.reload();
        },
      }
    );

    const validForm = computed(() => {
      return (
        credentials.authString != "" &&
        passwordValid.test(credentials.newPassword)
      );
    });

    return {
      credentials,
      newPassword,
      authDetails,
      validForm,
    };
  },
};
</script>

<style lang="scss">
div.auth-verify {
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
    height: 50vh;

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

  .new-otp {
    color: var(--theme-0-100);
    margin-top: 1vh;
    text-decoration: underline;
    cursor: pointer;
  }

  .otp-help {
    color: var(--theme-0-100);
    margin-top: 3vh;
    margin-bottom: 3vh;
  }
}
</style>
