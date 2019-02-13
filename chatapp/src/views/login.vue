<template>
  <v-layout>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md6>
            <v-card class="cardform">
              <v-flex class="contentWrapper">
                <transition
                  name="alert-anim"
                  enter-active-class="animated shake"
                  leave-active-class="animated fadeOut"
                >
                  <v-alert
                    class="alertPopUp"
                    v-if="authenticationError"
                    style="margin-top: 0px; border-top: 0"
                    :value="true"
                    type="error"
                  >{{ authenticationError }}</v-alert>
                </transition>
                <v-flex class="authWrapper">
                  <div class="logo">
                    <img src="../assets/logo.png">
                  </div>

                  <v-form class="authform">
                    <v-text-field
                      prepend-icon="person"
                      name="login"
                      v-model="user.username"
                      label="Username"
                      type="text"
                      required
                    ></v-text-field>

                    <v-text-field
                      prepend-icon="lock"
                      name="password"
                      v-model="user.password"
                      label="Password"
                      type="password"
                      required
                    ></v-text-field>
                    <transition
                      name="extrafield-anim"
                      enter-active-class="animated fadeIn"
                      leave-active-class="animated fadeOut"
                    >
                      <v-text-field
                        v-if="!logingIn"
                        class="extraFieldAnimation"
                        prepend-icon="lock"
                        name="password"
                        v-model="user.confirmpassword"
                        label="Confirm Password"
                        type="password"
                        required
                      ></v-text-field>
                    </transition>

                    <v-card-actions v-if="logingIn">
                      <p class="signUpText">
                        Don't have an account?
                        <span
                          class="signUpLink"
                          @click="logingIn = !logingIn"
                        >Sign Up</span>
                      </p>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="handleLogIn()">Login</v-btn>
                    </v-card-actions>

                    <v-card-actions transition="fade-transition" v-else>
                      <p class="signUpText">
                        Have an account?
                        <span class="signUpLink" @click="changeForm()">Log In</span>
                      </p>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="handleSignUp()">Sign Up</v-btn>
                    </v-card-actions>
                  </v-form>
                </v-flex>
              </v-flex>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script>
import axios from "axios";
import Joi from "joi";
import animateCss from "animate.css";
import { mapGetters, mapActions } from "vuex";

const schema = Joi.object().keys({
  username: Joi.string()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .trim()
    .min(3)
    .required(),
  confirmpassword: Joi.string()
    .trim()
    .min(3)
    .required()
});

export default {
  data: () => ({
    alert: {
      message: "",
      type: ""
    },
    user: {
      username: "",
      password: "",
      confirmpassword: ""
    },
    logingIn: true
  }),
  computed: {
    ...mapGetters([
      "authenticating",
      "authenticationError",
      "authenticationErrorCode"
    ])
  },
  watch: {
    user: {
      handler() {
        this.alert.message = "";
      },
      deep: true
    }
  },

  methods: {
    //store actions
    ...mapActions(["login", "signUp"]),
    validUser() {
      if (
        this.user.confirmpassword &&
        this.user.password !== this.user.confirmpassword
      ) {
        this.$store.commit("authenticationError", "The passwords must match");
        return false;
      }
      const result = Joi.validate(
        {
          username: this.user.username,
          password: this.user.password
        },
        schema
      );
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes("username")) {
        console.log(this.$store)
        this.$store.commit("authenticationError", "Username is invalid");
      } else {
        this.$store.commit("authenticationError", "Password is invalid");
      }
      return false;
    },
    changeForm() {
      this.logingIn = !this.logingIn;
    },
    handleLogIn() {
      if (this.validUser()) {
        this.login({
          username: this.user.username,
          password: this.user.password
        });
      }
    },
    handleSignUp() {
      if (this.validUser()) {
        this.signUp({
          username: this.user.username,
          password: this.user.password
        });
      }
    }
  }
};
</script>

<style scoped>
.cardform {
  width: 100%;
}
.alertPopUp {
  position: absolute;
  width: 100%;
  left: 50%;
  transform: translate(-50%);
}
.contentWrapper {
  height: 350px;
}
.authWrapper {
  width: 100%;
  height: 350px;
  display: inline-flex;
  padding: 60px;
  padding-bottom: 0;
  padding-top: 0;
  position: absolute;
}
.authform {
  width: 80%;
  padding-top: 30px;
  padding-left: 30px;
  align-self: center;
}
.logo {
  align-self: center;
}
.signUpText {
  margin-right: 20px;
}
.signUpLink {
  color: #3486d7;
}
.signUpLink:hover {
  cursor: pointer;
}
.extraFieldAnimation {
  animation-duration: 0.2s;
}
</style>


