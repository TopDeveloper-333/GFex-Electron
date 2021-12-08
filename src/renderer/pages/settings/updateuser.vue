<template>
  <card :title="$t('User Management')">
    <vue-confirm-dialog></vue-confirm-dialog>
    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">    
      <p class="gf-item">Edit User</p>
      
      <!-- Name -->
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label text-md-end">{{ $t('name') }}</label>
        <div class="col-md-7">
          <input v-model="userInfo.name" class="form-control" type="text">
        </div>
      </div>

      <!-- Email -->
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label text-md-end">{{ $t('email') }}</label>
        <div class="col-md-7">
          <input v-model="userInfo.email" class="form-control" type="email">
        </div>
      </div>

      <!-- User Role -->
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label text-md-end">{{ $t('User Role') }}</label>
        <div class="col-md-7">
          <select class="form-select" v-model="userInfo.role">
            <option selected value="0">Permanent</option>
            <option value="1">Daily-based</option>
          </select>
        </div>
      </div>

      <!-- From To -->
      <div class="mb-3 row" v-show="userInfo.role != undefined && userInfo.role == 1">
        <label class="col-md-3 col-form-label text-md-end">{{ $t('From') }}</label>
        <div class="col-md-3">
          <input v-model="userInfo.from" class="form-control" type="date">
        </div>
        <label class="col-md-1 col-form-label text-md-end">{{ $t('To') }}</label>
        <div class="col-md-3">
          <input v-model="userInfo.to" class="form-control" type="date">
        </div>
      </div>

      <!-- Revoke -->
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label text-md-end">{{ $t('User status') }}</label>
        <div class="col-md-7">
          <select class="form-select" v-model="userInfo.is_revoke">
            <option selected value="0">Opened</option>
            <option value="1">Closed</option>
          </select>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mb-3 row">
        <div class="col-md-9 ms-md-auto">
          <label class="btn btn-primary" v-on:click="onUpdate">Update User</label>
          <label class="btn btn-primary" v-on:click="onBack">Back</label>
        </div>
      </div>
    </div>

  </card>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
import Form from 'vform'
import store from '~/store'
import { mapState } from 'vuex'
import Multiselect from 'vue-multiselect'

export default {
  scrollToTop: false,

  middleware: ['auth', 'theme'],

  components: {
    Multiselect
  },

  metaInfo () {
    return { title: this.$t('settings') }
  },

  data() {
    return {
      userInfo: null,
    }
  },
  computed:{
  },

  created () {
    this.userInfo = this.$route.params
  },

  methods: {
    async onUpdate() {

      if (this.userInfo.role == 1) {
        if (this.userInfo.from == undefined || this.userInfo.from == null){
          this.$confirm({
            message: 'Please choose <from> date field for the user',
            button: {
              yes: 'OK'
            }
          })
          return;
        }

        if (this.userInfo.to == undefined || this.userInfo.to == null){
          this.$confirm({
            message: 'Please choose <to> date field for the user',
            button: {
              yes: 'OK'
            }
          })
          return;
        }
      }
      else {
        this.userInfo.from = null
        this.userInfo.to = null
      }

      await store.dispatch('auth/updateOtherUser', this.userInfo)
      this.$router.go(-1)
    },
    onBack() {
      this.$router.go(-1)
    }
  }
}

</script>
