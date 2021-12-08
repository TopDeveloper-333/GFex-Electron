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
        <form @submit.prevent="reset" @keydown="form.onKeydown($event)">
          <alert-success :form="form" :message="status" />

          <div class="card-header gf-header" style="background:var(--background-color);color:rgb(13, 110, 253);font-size:3rem">
            Reset Password
          </div>


          <!-- Email -->
          <div class="mb-3 row" style="margin-top:32px">
            <label class="col-md-3 col-form-label text-md-end gf-control">{{ $t('email') }}</label>
            <div class="col-md-7">
              <input v-model="form.email" :class="{ 'is-invalid': form.errors.has('email') }" 
                class="form-control gf-control" type="email" name="email" readonly>
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

          <!-- Password Confirmation -->
          <div class="mb-3 row">
            <label class="col-md-3 col-form-label text-md-end gf-control">{{ $t('confirm_password') }}</label>
            <div class="col-md-7">
              <input v-model="form.password_confirmation" :class="{ 'is-invalid': form.errors.has('password_confirmation') }" 
                class="form-control gf-control" type="password" name="password_confirmation">
              <has-error :form="form" field="password_confirmation" />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mb-3 row">
            <div class="col-md-9 ms-md-auto">
              <v-button class="gf-button" :loading="form.busy">
                {{ $t('reset_password') }}
              </v-button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Form from 'vform'

export default {
  middleware: ['guest', 'theme'],

  metaInfo () {
    return { title: this.$t('reset_password') }
  },

  data: () => ({
    status: '',
    form: new Form({
      token: '',
      email: '',
      password: '',
      password_confirmation: ''
    })
  }),

  created () {
    this.form.email = this.$route.query.email
    this.form.token = this.$route.params.token
  },

  methods: {
    async reset () {
      const { data } = await this.form.post('/api/password/reset')

      this.status = data.status

      this.form.reset()
    }
  }
}
</script>
