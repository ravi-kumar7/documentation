<template>
  <div class="login-form">
    <div class="form-header">Password</div>
    <div>
      <input type="password" class="form-control" v-model="var1">
    </div>

    <div class="btn-row">
      <button class="btn" @click="login">
        Validate
      </button>
    </div>
  </div>
</template>

<script>
import { STORAGE_KEY } from './helper'
import MD5 from "crypto-js/md5";

export default {
  data () {
    return {
      var1: ''
    }
  },
  methods: {
    login () {
      var isCorrect = false
      if (this.var1) {
        var hashedValue = MD5(this.var1).toString()
        if (hashedValue == "e0956577147184845d5bd2249abb417b") {
          const data = JSON.stringify({
            time: new Date().getTime()
          })
          window.localStorage.setItem(STORAGE_KEY, data)
          this.$emit('close', true)
          isCorrect = true
        }
      } 
      if (!isCorrect) {
        alert("Incorrect Password")
      }
    }
  }
}
</script>

<style lang="stylus">

.v-dialog-overlay
  background-color #777 !important
  opacity 1 !important

.v-dialog-header
  height: 0 !important

.login-form
  padding: 1rem
  display flex
  flex-direction column
  box-sizing border-box
  .btn-row
    margin-top 1rem
    text-align center;
  .btn
    padding 0.6rem 2rem
    outline none
    background-color #60C084
    color white
    border 0
  .form-header
    color #666
    margin-bottom 0.5rem
  .form-control
    padding 0.6rem
    border 2px solid #ddd
    width 100%
    margin-bottom 0.5rem
    box-sizing border-box
    outline none
    transition border 0.2s ease
    &:focus
      border 2px solid #aaa
</style>