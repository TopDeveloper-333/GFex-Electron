<template>
  <div style="background-image: url(/assets/image/LOGIN_BACKGROUND.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    height: 100vh;">

  <div class="row">
    <div class="col-lg-7 m-auto">
      <div class="card" style="margin-top:20px">
        <form @submit.prevent="login" @keydown="form.onKeydown($event)">
        <div class="card-header gf-header" style="background:yellow;color:rgb(13, 110, 253);font-size:3rem">
           LogIn
        </div>
        <div class="row" style="margin-top:32px">
          <!-- Email -->
          <div class="mb-3 row">
            <label class="col-md-3 col-form-label text-md-end gf-control">{{ $t('email') }}</label>
            <div class="col-md-7">
              <input v-model="form.email" :class="{ 'is-invalid': form.errors.has('email') }" 
                class="form-control gf-control" type="email" name="email">
              <has-error :form="form" field="email" />
            </div>
          </div>

          <!-- Password -->
          <div class="mb-3 row">
            <label class="col-md-3 col-form-label text-md-end gf-control">{{ $t('password') }}</label>
            <div class="col-md-7">
              <input v-model="form.password" :class="{ 'is-invalid': form.errors.has('password') }" 
                class="form-control gf-control" type="password" name="password">
              <has-error :form="form" field="password" />
            </div>
          </div>

          <!-- Remember Me -->
          <div class="mb-3 row">
            <div class="col-md-3" />
            <div class="col-md-7 d-flex">
              <!-- <checkbox v-model="remember" name="remember">
                {{ $t('remember_me') }}
              </checkbox> -->

              <router-link :to="{ name: 'password.request' }" class="small ms-auto my-auto">
                {{ $t('forgot_password') }}
              </router-link>
            </div>
          </div>

          <div class="mb-3 row">
            <div class="col-md-7 offset-md-3 d-flex">
              <!-- Submit Button -->
              <v-button class="gf-button" :loading="form.busy">
                {{ $t('login') }}
              </v-button>

              <!-- GitHub Login Button -->
              <login-with-github />
            </div>
          </div>
        </div>
        </form>
      </div>
      <!-- <img src="/assets/image/LOGIN_BACKGROUND.png"> -->
    </div>
  </div>
  </div>
</template>

<script>
import Form from 'vform'
import Cookies from 'js-cookie'
import LoginWithGithub from '~/components/LoginWithGithub'

export default {
  components: {
    LoginWithGithub
  },

  middleware: 'guest',

  metaInfo () {
    return { title: this.$t('login') }
  },

  data: () => ({
    form: new Form({
      email: '',
      password: ''
    }),
    remember: false
  }),

  methods: {
    async login () {
      // Submit the form.
      const { data } = await this.form.post('/api/login')

      // Save the token.
      this.$store.dispatch('auth/saveToken', {
        token: data.token,
        remember: this.remember
      })

      // Fetch the user.
      await this.$store.dispatch('auth/fetchUser')

      // Redirect home.
      this.redirect()
    },

    redirect () {
      const intendedUrl = Cookies.get('intended_url')

      if (intendedUrl) {
        Cookies.remove('intended_url')
        this.$router.replace({ path: intendedUrl })
      } else {
        this.$router.replace({ name: 'home' })
      }
    }
  }
}
</script>
