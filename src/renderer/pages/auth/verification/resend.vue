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
        <div class="card-header gf-header" style="background:var(--background-color);color:rgb(13, 110, 253);font-size:3rem">
           Resend verification
        </div>
        <form @submit.prevent="send" @keydown="form.onKeydown($event)">
          <alert-success :form="form" :message="status" />

          <!-- Email -->
          <div class="mb-3 row">
            <label class="col-md-3 col-form-label text-md-end">{{ $t('email') }}</label>
            <div class="col-md-7">
              <input v-model="form.email" :class="{ 'is-invalid': form.errors.has('email') }" class="form-control" type="email" name="email">
              <has-error :form="form" field="email" />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mb-3 row">
            <div class="col-md-9 ms-md-auto">
              <v-button :loading="form.busy">
                {{ $t('send_verification_link') }}
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
    return { title: this.$t('verify_email') }
  },

  data: () => ({
    status: '',
    form: new Form({
      email: ''
    })
  }),

  created () {
    if (this.$route.query.email) {
      this.form.email = this.$route.query.email
    }
  },

  methods: {
    async send () {
      const { data } = await this.form.post('/api/email/resend')

      this.status = data.status

      this.form.reset()
    }
  }
}
</script>
