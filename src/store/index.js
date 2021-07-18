import Vue from 'vue'
import Vuex from 'vuex'
import { boardStore } from './modules/board.store'
import { userStore } from './modules/user.store'
Vue.use(Vuex)

export default new Vuex.Store({
   state: {
      userMsg: {
         txt: '',
         type: ''
      },
      setTimeId:null,
   },
   getters: {
      userMsg({ userMsg }) { return userMsg }
   },
   mutations: {
      setMsg(state, { msg }) {
         state.userMsg = msg;
      }
   },
   actions: {
      async showMsg({ state,commit }, { msg }) {
         try {
            if(state.setTimeId) clearTimeout(state.setTimeId);
            commit({ type: 'setMsg', msg });
             msg = {
               txt: '',
               type: ''
            }
            state.setTimeId = setTimeout(() => {
               commit({ type: 'setMsg', msg });
               clearTimeout(state.setTimeId)
            }, 2500)
         } catch (err) {
            console.log('ERROR: cannot get userMsg', err);
         }
      }
   },
   modules: {
      boardStore,
      userStore,
   }
})
