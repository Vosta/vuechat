<template>
  <v-layout>
    <v-content>
      <v-container fluid fill-height style="padding-top: 0">
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

                  <div v-if="logginIn" class="logo">
                    <img src="../assets/logo.png">
                  </div>

                  <v-avatar v-else @click="toggleAvatarDialog" class="avatarImage bigAvatarImage" size=200>
                    <img :src="currentAvatar">
                  </v-avatar>
      
                  <avatar-picker v-if="avatarDialog">
                    <v-flex></v-flex>
                  </avatar-picker>
                
                  <v-form v-else class="authform" @submit.prevent="">
                    <v-text-field
                      prepend-icon="person"
                      name="username"
                      v-model="user.username"
                      label="Username"
                      type="text"
                      v-validate="'required|alpha_dash|min:3'"
                      :error-messages="errors.first('username')"
                    ></v-text-field>

                    <v-text-field
                      prepend-icon="lock"
                      name="password"
                      v-model="user.password"
                      label="Password"
                      type="password"
                      v-validate="'required|min:3'"
                      :error-messages="errors.first('password')"
                      ref= 'password'
                    ></v-text-field>

                    <transition
                      name="extrafield-anim"
                      enter-active-class="animated fadeIn"
                      leave-active-class="animated fadeOut"
                    >
                      <v-text-field
                        v-if="!logginIn"
                        class="extraFieldAnimation"
                        prepend-icon="lock"
                        name="confirmpassword"
                        v-model="user.confirmpassword"
                        label="Confirm Password"
                        type="password"
                        v-validate="'required|confirmed:password|min:3'"
                        :error-messages="errors.first('confirmpassword')"
                      ></v-text-field>
                    </transition>

                    <v-card-actions v-if="logginIn">
                      <p class="signUpText">
                        Don't have an account?
                        <span class="signUpLink" @click="changeForm()">Sign Up</span>
                      </p>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" type="submit" @click="handleLogIn()">Login</v-btn>
                    </v-card-actions>

                    <v-card-actions transition="fade-transition" v-else>
                      <p class="signUpText">
                        Have an account?
                        <span class="signUpLink" @click="changeForm()">Log In</span>
                      </p>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" type="submit" @click="handleSignUp()">Sign Up</v-btn>
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
import "animate.css";
import { mapGetters, mapActions, mapMutations } from "vuex";
import avatarPicker from '../components/dialogs/avatarDialog.vue'
export default {
  components: {
    avatarPicker
  },
  data: () => ({
    alert: {
      message: "",
      type: ""
    },
    user: {
      username: "",
      password: "",
      confirmpassword: "",
    },
    logginIn: true,
  }),
  computed: {
    ...mapGetters(["authenticationError","currentAvatar", "avatarDialog"]),
  },
  watch: {
    user: {
      handler(){
        this.SET_authenticationError('');
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(["login", "signUp"]),
    ...mapMutations(["SET_avatarDialog", "SET_authenticationError", "SET_DefaultState"]),

    changeForm() {
      this.logginIn = !this.logginIn; //change formular
      Object.keys(this.user).forEach(v => this.user[v] = ''); //clear the fields
    },
    isValid(){
      return this.$validator.validate();
    },
    handleLogIn() {
      if (this.isValid()) {
        this.login({
          username: this.user.username,
          password: this.user.password
        });
      }
    },
    handleSignUp() {
      if (this.isValid()) {
        this.signUp({
          username: this.user.username,
          password: this.user.password,
          avatar: this.currentAvatar,
        });
      }
    },
    toggleAvatarDialog(){
      this.SET_avatarDialog(!this.avatarDialog);
    },
  },
  mounted() {
    this.SET_DefaultState()
  },
};
</script>

<style>
.cardform {
  width: 100%;
}
.alertPopUp {
  position: absolute;
  width: 100%;
  left: 50%;
  transform: translate(-50%);
}
.alertValidate {
  color: red;
  position: absolute;
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
.bigAvatarImage{
  border: 2px solid black;
  align-self: center;
}
.avatarImage:hover{
  cursor: pointer;
  filter: brightness(120%);
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


