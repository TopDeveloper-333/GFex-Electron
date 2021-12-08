<template>
  <card :title="$t('Users Management')">
    <vue-confirm-dialog></vue-confirm-dialog>
    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
    
      <p class="gf-item">Add new user</p>
      
      <!-- Name -->
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label text-md-end">{{ $t('name') }}</label>
        <div class="col-md-7">
          <input v-model="name" class="form-control" type="text" name="name">
        </div>
      </div>

      <!-- Email -->
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label text-md-end">{{ $t('email') }}</label>
        <div class="col-md-7">
          <input v-model="email" class="form-control" type="email" name="email">
        </div>
      </div>

      <!-- Password -->
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label text-md-end ">{{ $t('password') }}</label>
        <div class="col-md-7">
          <input v-model="password" class="form-control" type="password" name="password">
        </div>
      </div>

      <!-- Password Confirmation -->
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label text-md-end">{{ $t('confirm_password') }}</label>
        <div class="col-md-7">
          <input v-model="password_confirmation" class="form-control" type="password" name="password_confirmation">
        </div>
      </div>

      <!-- User Role -->
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label text-md-end">{{ $t('User Role') }}</label>
        <div class="col-md-7">
          <select class="form-select" name="role" v-model="role">
            <option selected value="0">Permanent</option>
            <option value="1">Daily-based</option>
          </select>
        </div>
      </div>

      <!-- From To -->
      <div class="mb-3 row" v-show="role != undefined && role == 1">
        <label class="col-md-3 col-form-label text-md-end">{{ $t('From') }}</label>
        <div class="col-md-3">
          <input v-model="from" class="form-control" type="date" name="from">
        </div>
        <label class="col-md-1 col-form-label text-md-end">{{ $t('To') }}</label>
        <div class="col-md-3">
          <input v-model="to" class="form-control" type="date" name="to">
        </div>
      </div>

      <!-- Revoke -->
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label text-md-end">{{ $t('User status') }}</label>
        <div class="col-md-7">
          <select class="form-select" name="status" v-model="is_revoke">
            <option selected value="0">Opened</option>
            <option value="1">Closed</option>
          </select>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mb-3 row">
        <div class="col-md-9 ms-md-auto">
          <label class="btn btn-primary" v-on:click="addNewUser()">Add new user</label>
        </div>
      </div>

    <div style="display:flex;margin-bottom:6px;text-align:left" class="row">
      <p class="gf-item">User List</p>
      <!-- <div id="usersListSheet"></div> -->
      <vue-good-table :columns="columns" :rows="users" 
                      max-height="300px"                      
                      :search-options="{enabled: true}"
                      :fixed-header="true"
                      :pagination-options="{enabled: true,mode: 'pages'}">
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'action'">
            <label class="btn btn-primary" v-on:click="onEditUser(props.row)">Edit</label>
            <label class="btn btn-danger" v-on:click="onDeleteUser(props.row)">Delete</label>
          </span>
          <span v-if="props.column.field == 'role'">
            <label v-show="`${props.row.role}` == 0">Permenant</label>
            <label v-show="`${props.row.role}` == 1">Daily-based</label>
          </span>
          <span v-else-if="props.column.field == 'is_revoke'">
            <label v-show="`${props.row.is_revoke}` == 0">Opened</label>
            <label v-show="`${props.row.is_revoke}` == 1">Closed</label>
          </span>
          <span v-else>
            {{props.formattedRow[props.column.field]}}
          </span>
        </template>
      </vue-good-table>
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
import 'vue-good-table/dist/vue-good-table.css'
import Index from './index.vue'

export default {
  scrollToTop: false,

  middleware: ['auth', 'theme'],

  components: {
    Multiselect,
    Index
  },

  metaInfo () {
    return { title: this.$t('settings') }
  },

  data() {
    return {
      name:'',
      email: '',
      password: '',
      password_confirmation: '',
      role: null,
      from: '',
      to: '',
      is_revoke: '',
      roleOption: [
        { name: 'Permanent', value: 0},
        { name: 'Daily-based', value: 1},
      ],
      // usersListSheet: null,
      columns: [
          {
              label:'Id',
              field:'id',
          },
          {
              label:'Name',
              field:'name',
          },
          {
              label:'Email',
              field:'email',
          },
          {
              label:'Role',
              field:'role',
              filterOptions: {
                enabled: true,
                placeholder: "Filter User's Role",
                filterDropdownItems: [  
                  { value: 0, text: 'Permenant' },  
                  { value: 1, text: 'Daily-based' },  
                ],
                trigger: 'enter', //only trigger on enter not on keyup 
              },
          },
          {
              label:'From',
              field:'from',
          },
          {
              label:'To',
              field:'to',
          },
          {
              label:'Revoke',
              field:'is_revoke',
              placeholder: "Filter User's status",
              filterOptions: {
                enabled: true,
                filterDropdownItems: [  
                  { value: 0, text: 'Opened' },  
                  { value: 1, text: 'Closed' },  
                ],
                trigger: 'enter', //only trigger on enter not on keyup 
              },
          },
          {
              label:'Action',
              field:'action',
          },
      ],

    }
  },
  computed:{
    ...mapState({
      users : state => state.auth.users,
    }),
  },

  async mounted () {
    await store.dispatch('auth/fetchUsers', 0)
  },

  methods: {
    onEditUser(row) {
      this.$router.push({ name: 'settings.updateuser', params: row})
    },
    async addNewUser () {
      if (this.role == 0) {
        this.from = null;
        this.to = null;
      }

      let result = await store.dispatch('auth/addUser', {
        'name': this.name,
        'email' : this.email,
        'password' : this.password,
        'password_confirmation' : this.password_confirmation,
        'role' : this.role,
        'from' : this.from,
        'to' : this.to,
        'is_revoke' : this.is_revoke
      })

      if (result.message != undefined) 
        alert(result.message)
      else {
        this.$router.go()
      }        
    },
    async onDeleteUser(row) {
      this.$confirm({
        message: 'Are you sure to delete this user: "' + row.name + '"?',
        button: {
          no: 'No',
          yes: 'Yes'
        },
        callback: async confirm => {
          if (confirm) {
            let result = await store.dispatch('auth/removeUser', row)
            this.$router.go()
          }
        }
      })
    }
  }
}

</script>
