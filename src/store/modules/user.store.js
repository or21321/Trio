import { userService } from '@/services/user.service'
// import { socketService, SOCKET_EMIT_USER_WATCH, SOCKET_EVENT_USER_UPDATED } from '../../services/socket.service'

// var localLoggedinUser = null;
// if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user || null);

export const userStore = {
   state: {
      loggedinUser: userService.getLoggedinUser(),
      users: [],
      // watchedUser: null
   },
   getters: {
      users({ users }) { return users },
      loggedinUser({ loggedinUser }) { return loggedinUser },
      // watchedUser({ watchedUser }) { return watchedUser }
   },
   mutations: {
      setLoggedinUser(state, { user }) {
         state.loggedinUser = user;
      },
      setUsers(state, { users }) {
         state.users = users;
      },
   },
   actions: {
      async login({ commit }, { userCred }) {
         try {
            const user = await userService.login(userCred);
            commit({ type: 'setLoggedinUser', user })
            return user;
         } catch (err) {
            console.log('userStore: Error in login', err)
            throw err
         }
      },
      async signup({ commit }, { userCred }) {
         try {
            const user = await userService.signup(userCred)
            commit({ type: 'setLoggedinUser', user })
            return user;
         } catch (err) {
            console.log('userStore: Error in signup', err)
            throw err
         }

      },
      async logout({ commit }) {
         try {
            await userService.logout()
            commit({ type: 'setLoggedinUser', user: null })
         } catch (err) {
            console.log('userStore: Error in logout', err)
            throw err
         }
      },
      async loadUsers({ commit }) {
         try {
            const users = await userService.getUsers();
            commit({ type: 'setUsers', users })
         } catch (err) {
            console.log('userStore: Error in loadUsers', err)
            throw err
         }
      },

      async loginAsGuest({ commit }) {
         try {
            const guestUser = await userService.loginAsGuest();
            commit({ type: 'setLoggedinUser', guestUser })
         } catch (err) {
            console.log('userStore: Error in loadUsers', err)
            throw err
         }
      }
      // async loadAndWatchUser({ commit }, { userId }) {
      //    try {
      //       const user = await userService.getById(userId);
      //       commit({ type: 'setWatchedUser', user })
      //       socketService.emit(SOCKET_EMIT_USER_WATCH, userId)
      //       socketService.off(SOCKET_EVENT_USER_UPDATED)
      //       socketService.on(SOCKET_EVENT_USER_UPDATED, user => {
      //          commit({ type: 'setWatchedUser', user })
      //       })
      //    } catch (err) {
      //       console.log('userStore: Error in loadAndWatchUser', err)
      //       throw err
      //    }
      // },
      // async updateUser({ commit }, { user }) {
      //    try {
      //       user = await userService.update(user);
      //       commit({ type: 'setUser', user })
      //    } catch (err) {
      //       console.log('userStore: Error in updateUser', err)
      //       throw err
      //    }

      // }
   }
}
