<template>
  <div class="login">
    <div class="login-form">
      <form>
        <div class="error" v-if="authData.error">{{ authData.error }}</div>
        <input type="text" v-model="credentials.identifier" />
        <input type="password" v-model="credentials.password" />
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
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import Cookies from "js-cookie";

const passwordValid = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$/;
export default {
  name: "Login",
  setup() {
    document.title = "Login | Rusafe";
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

    let authData = ref({
      jwt: null,
      error: null,
    });

    const { mutate: login } = useMutation(
      gql`
        mutation login($identifier: String!, $password: String!) {
          login(identifier: $identifier, password: $password) {
            jwt
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

<style lang="scss"></style>
