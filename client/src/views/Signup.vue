<template>
  <div class="login">
    <div class="title">Sign Up</div>
    <div class="login-form">
      <div class="error" v-if="authData.error">{{ authData.error }}</div>
      <form>
        <input
          type="text"
          required
          placeholder="Name*"
          v-model.trim="credentials.name"
        />
        <input
          type="text"
          required
          placeholder="Username*"
          v-model.trim="credentials.username"
        />
        <input
          type="text"
          required
          placeholder="Email*"
          v-model.trim="credentials.email"
        />
        <input
          type="password"
          required
          placeholder="Password*"
          v-model="credentials.password"
        />
        <input
          type="text"
          placeholder="Profile Picture Link (Optional)"
          v-model.trim="credentials.img"
        />
        <input
          type="tel"
          placeholder="Phone Number (Without Region Codes)*"
          v-model.number="credentials.phone"
        />
        <button
          type="submit"
          v-bind="{ disabled: !validSignup }"
          @click.prevent="
            signup({
              name: credentials.name,
              username: credentials.username,
              email: credentials.email,
              password: credentials.password,
              img:
                credentials.img === ''
                  ? `https://avatars.dicebear.com/api/identicon/${credentials.username}.svg`
                  : credentials.img,
              phone: credentials.phone,
            })
          "
        >
          Submit
        </button>
      </form>
      <router-link class="signup-links" to="/login">
        Already registered? Login
      </router-link>

      <div class="password-rules" to="/login">
        Password must have atleast 8 characters, a special symbol and a number
      </div>
    </div>

    <!-- TODO: Add Password rules -->
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import Cookies from "js-cookie";
import router from "../router/index";
import gql from "graphql-tag";

const emailValid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordValid = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$/;
const phoneValid = /^[0-9]{10}$/;

export default {
  name: "Login",
  setup() {
    // Page Title
    document.title = "Sign Up | Rusafe";

    // Get JWT
    if (Cookies.get("jwt")) {
      router.push("/profile");
    }

    // Form Data
    const credentials = reactive({
      name: "",
      username: "",
      email: "",
      password: "",
      dob: [],
      img: "",
      phone: null,
    });

    const validSignup = computed(() => {
      return (
        credentials.name !== "" &&
        credentials.username !== "" &&
        emailValid.test(credentials.email) &&
        passwordValid.test(credentials.password) &&
        phoneValid.test(credentials.phone)
      );
    });

    // Login
    let authData = ref({
      error: null,
    });

    const { mutate: signup } = useMutation(
      gql`
        mutation signup(
          $name: String!
          $username: String!
          $email: String!
          $password: String!
          $img: String!
          $phone: Float!
        ) {
          signup(
            name: $name
            username: $username
            email: $email
            password: $password
            img: $img
            phone: $phone
          ) {
            error
          }
        }
      `,
      {
        update: (_cache, result) => {
          if (result.data.signup.error) {
            authData.value.error = result.data.signup.error;
            return;
          }
          router.push({
            name: "Otp Verify",
            params: { identifier: credentials.username },
          });
        },
      }
    );

    return {
      credentials,
      signup,
      validSignup,
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
    margin-bottom: 2vh;
    color: var(--theme-1-100);
    text-transform: uppercase;
  }

  div.login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1vh;
    width: 40%;
    height: 70vh;

    div.error {
      color: red;
      width: 80%;
      padding: 2vh;
      border-radius: 1vh;
      margin-bottom: 2vh;
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

        margin-bottom: 1vh;

        background-color: var(--theme-8-100);
        border: 0.3vh solid var(--theme-7-100);
        color: var(--theme-2-100);
      }

      button[type="submit"] {
        outline: none;
        text-decoration: none;
        padding: 2vh 5vh;
        margin-top: 1vh;
        margin-bottom: 1vh;
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

    .signup-links {
      color: var(--theme-0-100);
      margin-top: 1vh;
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .password-rules {
    color: var(--theme-0-100);
    margin-top: 3vh;
  }
}
</style>
