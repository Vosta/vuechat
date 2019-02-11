<template>
  <v-layout>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card>

              <v-toolbar dark color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-alert
              v-if="errorMessage"
                style="margin-top: 0px; border-top: 0"
                :value="true"
                type="error"
              >
                {{ errorMessage }}
              </v-alert>

              <v-card-text>

                <v-form>

                  <v-text-field
                    prepend-icon="person"
                    name="login"
                    v-model="user.username"
                    label="Login"
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

                  <v-text-field
                    prepend-icon="lock"
                    name="password"
                    v-model="user.confirmpassword"
                    label="Confirm Password"
                    type="password"
                    required
                  ></v-text-field>

                </v-form>
    
              </v-card-text>

              <v-flex style="display: inline-flex">

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="login()">Login</v-btn>
                </v-card-actions>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="register()">Register</v-btn>
                </v-card-actions>

              </v-flex>

            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script>
import axios from 'axios';
import Joi from 'joi';

const SIGNUP_URL = `http://localhost:5000/auth/signup`;
const LOGIN_URL = `http://localhost:5000/auth/login`;
const schema = Joi.object().keys({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().trim().min(3).required(),
    confirmpassword: Joi.string().trim().min(3).required(),

});

export default {
  data: () => ({
    errorMessage: "",
    user: {
      username: "",
      password: "",
      confirmpassword: ""
    }
  }),
  watch: {
    user: {
        handler() {
          this.errorMessage = '';
        },
        deep: true
    }
  },
  methods: {
    validUser() {      
      if (this.user.password !== this.user.confirmpassword) {
        this.errorMessage = "The passwords must match";
        return false;
      }
      const result = Joi.validate(this.user, schema);
      if(result.error === null){
        return true;
      } 
      if (result.error.message.includes('username')){
        this.errorMessage = 'Username is invalid';
      } else {
        this.errorMessage = 'Password is invalid';
      }
      return false
    },
    login() {
      if(this.validUser()){
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
            this.$router.push('/home');
            return response;
          })
          .catch(error => {
            this.errorMessage = error.response.data.message;
          });
      }
    },
    register() {
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
            return response;
          })
          .catch(error => {
            this.errorMessage = error.response.data.message;
          });
      }
    }
  }
};
</script>

