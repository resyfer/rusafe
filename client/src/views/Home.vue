<template>
  <div class="home">
    <div class="logo">
      <img src="../assets/logo.png" alt="Rusafe Logo" />
    </div>

    <div class="title">
      <h1>Rusafe</h1>
      <h2>An e-wallet to easily and securely transfer funds</h2>
    </div>

    <div class="auth">
      <router-link to="/login" class="auth-itm" id="login">Login</router-link>
      <router-link to="/signup" class="auth-itm" id="signup">
        Sign Up
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  setup() {
    document.title = "Rusafe";
  },
};
</script>

<style lang="scss">
div.home {
  height: 100vh;
  width: 100%;
  background-color: var(--theme-8-100);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .logo {
    height: 30vh;

    img {
      height: 100%;
    }
  }

  .title {
    color: var(--theme-1-100);
    text-align: center;
    margin-top: 7vh;

    h1 {
      text-transform: uppercase;
      font-size: 5vh;
    }

    h2 {
      margin-top: 2vh;
      font-weight: normal;
    }
  }

  .auth {
    margin-top: 6vh;

    .auth-itm {
      text-decoration: none;
      padding: 2vh 5vh;
      margin-right: 1vh;
      border-radius: 0.75vh;
      text-transform: uppercase;

      &:hover {
        transition: 0.2s ease-in-out;
      }
    }

    #login {
      border: 0.2vh solid var(--theme-5-100);
      color: var(--theme-5-100);

      &:hover {
        border: 0.2vh solid var(--theme-5-000);
        background-color: var(--theme-5-100);
        color: var(--theme-2-100);
      }
    }

    #signup {
      border: 0.2vh solid var(--theme-5-000);
      background-color: var(--theme-5-100);
      color: var(--theme-2-100);

      &:hover {
        border: 0.2vh solid var(--theme-5-100);
        background-color: var(--theme-8-100);
        color: var(--theme-5-100);
      }
    }
  }
}
</style>
