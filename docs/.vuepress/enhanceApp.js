import { checkAuth } from './login/helper'
import Login from './login/Login'

export default ({
  Vue,
  options,
  router,
  siteData
}) => {
  Vue.mixin({
    mounted() {
      const doCheck = () => {
        if (!checkAuth()) {
          if(this.$router && this.$router.currentRoute){
            var currentPath = this.$router.currentRoute.path.split("/")[1]
            if (currentPath.toLowerCase() === "middleware") {
              this.$dlg.modal(Login, {
                width: 300,
                height: 200,
                title: '',
                singletonKey: 'docs-login',
                maxButton: false,
                closeButton: false,
                callback: data => {
                  if (data === true) {
                    // do some stuff after login
                  }
                }
              })
            }
          }
        }
      }

      if (this.$dlg) {
        doCheck()
      } else {
        import('v-dialogs').then(resp => {
          Vue.use(resp.default)
          this.$nextTick(() => {
            doCheck()
          })
        })
      }
    }
  })
}