// import { storageService } from './async-storage.service'
// import { httpService } from './http.service'
// import { socketService, SOCKET_EVENT_USER_UPDATED } from './socket.service'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
// const SCORE_FOR_REVIEW = 10
// var gWatchedUser = null;

export const userService = {
   login,
   logout,
   signup,
   getUsers,
   getById,
   getLoggedinUser,
   signupAsGuest,
   getMiniUser
   // update,
}

// window.userService = userService
// Note: due to async, must run one by one...
// userService.signup({fullname: 'Puki Norma', username: 'user1', password:'123',score: 100, isAdmin: false})
// userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 100, isAdmin: true})
// userService.signup({fullname: 'Muki G', username: 'muki', password:'123', score: 100})

function getUsers() {
   return storageService.query('user')
   // return httpService.get(`user`)
}

async function getById(userId) {
   try {
      const user = await storageService.get('user', userId)
      // const user = await httpService.get(`user/${userId}`)
      gWatchedUser = user;
      return user;
   } catch (err) {
      console.log('userService: Error in getById user', err)
      throw err
   }

}

// async function update(user) {
//    try {
//       await storageService.put('user', user)
//       // user = await httpService.put(`user/${user._id}`, user)
//       // Handle case in which admin updates other user's details
//       if (getLoggedinUser()._id === user._id) _saveLocalUser(user)
//       return user;
//    } catch (err) {
//       console.log('userService: Error in update user', err)
//       throw err
//    }
// }

async function login(userCred) {
   try {
      const users = await storageService.query('user')
      const user = users.find(user => user.username === userCred.username)
      return _saveLocalUser(user)
      // const user = await httpService.post('auth/login', userCred)
      // socketService.emit('login', user._id);
      // if (user) return _saveLocalUser(user)
   } catch (err) {
      console.log('userService: Error in login user', err)
      throw err
   }
}
async function signup(userCred) {
   try {
      const user = await storageService.post('user', userCred)
      // const user = await httpService.post('auth/signup', userCred)
      // socketService.emit('set-user-socket', user._id);
      return _saveLocalUser(user)
   } catch (err) {
      console.log('userService: Error in signup user', err)
      throw err
   }
}
async function logout() {
   sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
   // try{
   // socketService.emit('unset-user-socket');
   // return await httpService.post('auth/logout')
   // } catch (err) {
   //    console.log('userService: Error in getUsers', err)
   //    throw err
   // }
}

function _saveLocalUser(user) {
   sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
   return user
}

function getLoggedinUser() {
   return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
}

async function signupAsGuest() {
   user = {
      fullname: 'Guest' + Date.now() % 10000,
      username: 'Guest',
      password: 'Guest',
      imgUrl: 'http://some-img.jpg', // need to add an avatar img
      mentions: []
   }
   return signup(user)
}

async function getMiniUser(userId) {
   try {
      const user = await getById(userId);
      return {
         _id: user._id,
         fullname: user.fullname,
         imgUrl: user.imgUrl,
      }
   } catch (err) {
      console.log('userService: Error in getById user', err)
      throw err
   }
}

// This IIFE functions for Dev purposes 
// It allows testing of real time updates (such as sockets) by listening to storage events
// (async () => {
//     var user = getLoggedinUser()
    // Dev Helper: Listens to when localStorage changes in OTHER browser

    // Here we are listening to changes for the watched user (comming from other browsers)
//     window.addEventListener('storage', async () => {
//         if (!gWatchedUser) return;
//         const freshUsers = await storageService.query('user')
//         const watchedUser = freshUsers.find(u => u._id === gWatchedUser._id)
//         if (!watchedUser) return;
//         if (gWatchedUser.score !== watchedUser.score) {
//             console.log('Watched user score changed - localStorage updated from another browser')
//             socketService.emit(SOCKET_EVENT_USER_UPDATED, watchedUser)
//         }
//         gWatchedUser = watchedUser
//     })
// })();

// This is relevant when backend is connected
// (async () => {
//     var user = getLoggedinUser()
//     if (user) socketService.emit('set-user-socket', user._id)
// })();