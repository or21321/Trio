// import { storageService } from './storage.service.js'
import { httpService } from './http.service'
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
   getMiniUser,
   createDemoUsers,
   updateUser
   // update,
}

// window.userService = userService
// Note: due to async, must run one by one...
// userService.signup({fullname: 'Puki Norma', username: 'user1', password:'123',score: 100, isAdmin: false})
// userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 100, isAdmin: true})
// userService.signup({fullname: 'Muki G', username: 'muki', password:'123', score: 100})

async function getUsers() {
   try {
      // return await storageService.query('users')
      var users = await httpService.get(`user`)
      // var users = await storageService.query('users')
      if (!users.length) {
         await createDemoUsers()
      }
   } catch (err) {
      console.log('userService: Error in getUsers', err)
      throw err
   }
   return users
}

// createTestUsers() {

// }

async function getById(userId) {
   try {
      // const user = await storageService.get('users', userId)
      const user = await httpService.get(`user/${userId}`)
      // gWatchedUser = user;
      return user;
   } catch (err) {
      console.log('userService: Error in getById user', err)
      throw err
   }

}

// async function update(user) {
//    try {
//       await storageService.put('users', user)
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
      // const users = await storageService.query('users')
      const user = await httpService.post('auth/login', userCred)
      // const user = users.find(user => user.username === userCred.username && user.password === userCred.password)
      if (user) return _saveLocalUser(user)
      // socketService.emit('login', user._id);
      // if (user) return _saveLocalUser(user)
   } catch (err) {
      console.log('userService: Error in login user', err)
      throw err
   }
}
async function signup(userCred) {
   try {
      // const user = await storageService.post('users', userCred)
      const user = await httpService.post('auth/signup', userCred)
      // socketService.emit('set-user-socket', user._id);
      return _saveLocalUser(user)
   } catch (err) {
      console.log('userService: Error in signup user', err)
      throw err
   }
}
async function logout() {
   sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
   try {
      // socketService.emit('unset-user-socket');
      return await httpService.post('auth/logout')
   } catch (err) {
      console.log('userService: Error in logout', err)
      throw err
   }
}

function _saveLocalUser(user) {
   sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
   return user
}

function getLoggedinUser() {
   return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
}

async function updateUser(user) {
   try {
      // console.log('from service', user);
      // if (user._id) {
      // queryParams += `&_id=${board._id}`
      // return storageService.put(KEY, board)
      // console.log('update user');
      const savedUser = await httpService.put(`user/${user._id}`, user)
      return savedUser
      // return axios.put(`http://localhost:3200/api/board`, board).then(res => res.data)
      // } else {
      // return storageService.post(KEY, board)
      // console.log('save user');
      // const savedUser = await httpService.post(`user`, user)
      // const savedBoard = await boardToSave
      // console.log('from service boardToSave', boardToSave);
      // return savedUser
      // return axios.get(`/api/board/add?${queryParams}`).then(res => res.data)
      // }
   } catch (err) {
      console.log('Had a problem adding mention', err);
      throw err
   }
}

async function signupAsGuest() {
   const user = {
      fullname: 'Guest' + Date.now() % 10000,
      username: 'Guest',
      password: 'Guest',
      imgUrl: '',
      mentions: []
   }
   return signup(user)
}

async function getMiniUser(userId) {
   try {
      const user = await getById(userId);
      return {
         _id: user._id,
         username: user.username,
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
//         const freshUsers = await storageService.query('users')
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


async function createDemoUsers() {
   try {
      const usersToAdd = [
         { fullname: "Guest1438", username: "Guest", email: "ysadasael@aa.com", password: "Guest", imgUrl: "", mentions: [] },
         { fullname: "Yael Hazan", username: "yael", email: "yael@aa.com", password: "123123", imgUrl: "https://res.cloudinary.com/or21321/image/upload/v1626387050/vnodxsvuzaeapjkgxw9g.jpg", mentions: [] },
         { fullname: "Dekel Livyani", username: "dekel", email: "dekel@gmail.com", password: "123123", imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg2DU9OQ6q9A4Alh_MYjoLzo6awn87MICqq6KenfafYqwT_JnQi3xmnQfRAQFMqFH2TFMjhS6V&usqp=CAc", mentions: [] },
         { fullname: "Or Hadar", username: "or", email: null, password: "123123", imgUrl: "http://res.cloudinary.com/or21321/image/upload/v1626387480/y5ox9qoe0xvuhmsyultn.jpg", mentions: [] },
         { fullname: "Eden Aran", username: "eden", email: "eden@gmail.com", password: "123123", imgUrl: "http://res.cloudinary.com/or21321/image/upload/v1626390579/xedxhssgnjtf68kd4gme.jpg", mentions: [] }
      ]
      await httpService.post('user', usersToAdd[0])
      await httpService.post('user', usersToAdd[1])
      await httpService.post('user', usersToAdd[2])
      await httpService.post('user', usersToAdd[3])
      await httpService.post('user', usersToAdd[4])
      await httpService.get('user')

   } catch (err) {
      console.log('err', err)
   }
}