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
           Verify Email
        </div>
        <template v-if="success">
          <div class="alert alert-success" role="alert">
            {{ success }}
          </div>

          <router-link :to="{ name: 'login' }" class="btn btn-primary">
            {{ $t('login') }}
          </router-link>
        </template>
        <template v-else>
          <div class="alert alert-danger" role="alert">
            {{ error || $t('failed_to_verify_email') }}
          </div>

          <router-link :to="{ name: 'verification.resend' }" class="small float-end">
            {{ $t('resend_verification_link') }}
          </router-link>
        </template>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios'

const qs = (params) => Object.keys(params).map(key => `${key}=${params[key]}`).join('&')

export default {
  async beforeRouteEnter (to, from, next) {
    try {
      const { data } = await axios.post(`/api/email/verify/${to.params.id}?${qs(to.query)}`)

      next(vm => { vm.success = data.status })
    } catch (e) {
      next(vm => { vm.error = e.response.data.status })
    }
  },

  middleware: ['guest', 'theme'],

  metaInfo () {
    return { title: this.$t('verify_email') }
  },

  data: () => ({
    error: '',
    success: ''
  })
}
</script>
