<template>
  <v-layout>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md6>
            <v-card class="cardform">
              <v-flex class="contentWrapper">
                <transition name="alert-anim"
                      enter-active-class="animated shake"
                      leave-active-class="animated fadeOut">
                <v-alert
                  class="alertPopUp"
                  v-if="alert.message"
                  style="margin-top: 0px; border-top: 0"
                  :value="true"
                  v-bind:type="alert.type"
                >{{ alert.message }}</v-alert>
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
                        <span class="signUpLink" @click="changeForm()">Sign Up</span>
                      </p>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="login()">Login</v-btn>
                    </v-card-actions>

                    <v-card-actions transition="fade-transition" v-else>
                      <p class="signUpText">
                        Have an account?
                        <span class="signUpLink" @click="changeForm()">Log In</span>
                      </p>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="signUp()">Sign Up</v-btn>
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

const SIGNUP_URL = `http://localhost:5000/auth/signup`;
const LOGIN_URL = `http://localhost:5000/auth/login`;
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

  watch: {
    user: {
      handler() {
        this.alert.message = "";
      },
      deep: true
    }
  },

  methods: {
    changeForm() {
      this.logingIn = !this.logingIn;
    },
    setAlert(message, type) {
      console.log(message);
      console.log(type);
      this.alert = {
        message,
        type
      };
    },
    validUser() {
      if (this.user.password !== this.user.confirmpassword) {
        this.setAlert("The passwords must match", "error");
        return false;
      }
      const result = Joi.validate(this.user, schema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes("username")) {
        this.setAlert("Username is invalid", "error");
      } else {
        this.setAlert("Password is invalid", "error");
      }
      return false;
    },
    login() {
      let body = {
        username: this.user.username,
        password: this.user.password
      };
      axios
        .post(LOGIN_URL, body, {
          headers: {
            "Content-type": "application/json"
          }
        })
        .then(response => {
          console.log(response);
          localStorage.authToken = response.data.token;
          this.$router.push('/home');
        })
        .catch(error => {
          console.log(error);
          this.setAlert(error.response.data.message, "error");
        });
    },
    signUp() {
      if (this.validUser()) {
        let body = {
          username: this.user.username,
          password: this.user.password
        };
        axios
          .post(SIGNUP_URL, body, {
            headers: {
              "Content-type": "application/json"
            }
          })
          .then(response => {
            console.log(response);
            this.changeForm();
            return response;
          })
          .catch(error => {
            console.log(error);
            this.setAlert(error.response.data.message, "error");
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
.alertPopUp{
  position: absolute;
  width: 100%;
  left: 50%;
  transform: translate(-50%)
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


