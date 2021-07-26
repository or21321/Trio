
import { httpService } from './http.service'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

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
}


async function getUsers() {
   try {
      var users = await httpService.get(`user`)
      if (!users.length) {
         await createDemoUsers()
      }
   } catch (err) {
      console.log('userService: Error in getUsers', err)
      throw err
   }
   return users
}

async function getById(userId) {
   try {
      const user = await httpService.get(`user/${userId}`)
      return user;
   } catch (err) {
      console.log('userService: Error in getById user', err)
      throw err
   }

}

async function login(userCred) {
   try {
      const user = await httpService.post('auth/login', userCred)
      if (user) return _saveLocalUser(user)
   } catch (err) {
      console.log('userService: Error in login user', err)
      throw err
   }
}
async function signup(userCred) {
   try {
      const user = await httpService.post('auth/signup', userCred)
      return _saveLocalUser(user)
   } catch (err) {
      console.log('userService: Error in signup user', err)
      throw err
   }
}
async function logout() {
   sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
   try {
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
      console.log('USER', user);
      const savedUser = await httpService.put(`user/${user._id}`, user)
      return savedUser
   } catch (err) {
      console.log('Had a problem adding mention', err);
      throw err
   }
}

async function signupAsGuest() {
   const user = {
      fullname: 'Guest',
      username: 'Guest' + Date.now() % 10000,
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