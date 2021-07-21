import { userService } from '@/services/user.service'
import { socketService, SOCKET_EMIT_USER_WATCH, SOCKET_EVENT_USER_UPDATED } from '@/services/socket.service'


export const userStore = {
   state: {
      loggedinUser: userService.getLoggedinUser(),
      users: [],
      watchedUser: null
   },
   getters: {
      users({ users }) { return users },
      loggedinUser({ loggedinUser }) { return loggedinUser },
      getMyMiniUser(otherGetters) {
         const miniUser = JSON.parse(JSON.stringify(otherGetters.loggedinUser))
         delete miniUser.email
         delete miniUser.mentions
         return miniUser
      },
      watchedUser({ watchedUser }) { return watchedUser }
   },
   mutations: {
      setLoggedinUser(state, { user }) {
         state.loggedinUser = user;
      },
      setUsers(state, { users }) {
         state.users = users;
      },
      updateUser(state, { user }) {
         const userIdx = state.users.findIndex(u => u._id === user._id)
         console.log('from commit before', state.users[userIdx]);
         console.log('from commit savign user', user);
         console.log('from commit idx', userIdx);
         state.users.splice(userIdx, 1, user)
      },
      setWatchedUser(state, { user }) {
         console.log('setWatchedUser', user);
         state.watchedUser = user;
      },
   },
   actions: {
      async loadAndWatchUser({ commit }, { userId }) {
         try {
            const user = await userService.getById(userId);
            commit({ type: 'setWatchedUser', user })
            socketService.emit(SOCKET_EMIT_USER_WATCH, userId)
            console.log('user-watch', userId);
            socketService.off(SOCKET_EVENT_USER_UPDATED)
            socketService.on(SOCKET_EVENT_USER_UPDATED, user => {
               console.log('user-updated from socket', user);
               commit({ type: 'setWatchedUser', user })
            })
         } catch (err) {
            console.log('userStore: Error in loadAndWatchUser', err)
            throw err
         }
      },
      async addMention(context, { username, cardId }) {
         try {
            await context.dispatch({ type: 'loadUsers' })
            const mention = {
               cardId
            }
            const userToSaveIdx = context.state.users.findIndex(u => u.username === username)
            const userToSave = JSON.parse(JSON.stringify(context.state.users[userToSaveIdx]))
            console.log('userToSave', userToSave);
            userToSave.mentions.push(mention)
            console.log('mentions.length', userToSave.mentions.length);
            const savedUser = await userService.updateUser(userToSave)
            context.commit({ type: 'updateUser', user: savedUser })
         } catch (err) {
            console.log('Had problem adding mention', err);
         }
      },
      async updateUser(context, { user }) {
         try {
            console.log('from updateUser', user);
            await context.dispatch({ type: 'loadUsers' })
            const savedUser = await userService.updateUser(user)
            console.log('from service savedUser', savedUser);
            context.commit({ type: 'updateUser', user: savedUser })

         } catch (err) {
            console.log('Had a problem updating user', err);
         }
      },
      async login({ commit, dispatch }, { userCred }) {
         try {
            const user = await userService.login(userCred);
            commit({ type: 'setLoggedinUser', user })
            await dispatch({
               type: "loadAndWatchUser",
               userId: user._id,
            });
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

      async signupAsGuest({ dispatch }) {
         try {
            const user = await userService.signupAsGuest();
            await dispatch({ type: 'loadAndWatchUser', userId: user._id })
            // commit({ type: 'setLoggedinUser', user })
         } catch (err) {
            console.log('userStore: Error in signup As Guest', err)
            throw err
         }
      },

      async getMiniUser(content, { userId }) {
         try {
            return await userService.getMiniUser(userId);
         } catch (err) {
            console.log('userStore: Error in getById user', err)
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
