// import { storageService } from "./storage.service.js";
import { userService } from "./user.service.js";
import { utilService } from "./util.service.js";
// import axios from 'axios'
import { httpService } from './http.service.js'
// const KEY = 'boards'


export const boardService = {
   query,
   getById,
   remove,
   removeGroup,
   removeCard,
   save,
   saveGroup,
   saveCard,
   getEmptyBoard,
   getEmptyGroup,
   getEmptyCard,
   addActivity,
   getCardById,
   getGroupById,
   addCheckbox,
   removeChecklist,
   removeCheckbox,
   addComment,
   removeComment,

}

//Board
async function query() {
   try {
      // var boards = await storageService.query(KEY)
      // if (!boards.length || !boards[0].groups.length) {
      //    const board = _createDemoBoard()
      //    await save(board);
      //    await storageService.query(KEY)
      // }
      // return boards
      // console.log('from query filterBy', filterBy);
      // const boards = await httpService.get('board', filterBy)
      const boards = await httpService.get('board')
      // console.log('from query', boards);
      return boards

   } catch (err) {
      console.log('query had an error', err);
   }
}

async function getById(boardId) {
   try {
      // return storageService.get(KEY, boardId)
      const board = await httpService.get(`board/${boardId}`)
      return board
   } catch (err) {
      console.log('Error:', err);
   }
}

async function remove(boardId) {
   try {
      // return storageService.remove(KEY, boardId)
      // console.log('from service', boardId);
      return httpService.delete(`board/${boardId}`)
   } catch (err) {
      console.log('Error:', err);
   }
}

async function save(board) {
   try {
      // var queryParams = `vendor=${board.vendor}&maxSpeed=${board.maxSpeed}`
      if (board._id) {
         // queryParams += `&_id=${board._id}`
         // return storageService.put(KEY, board)
         const savedBoard = httpService.put(`board`, board)
         return savedBoard
         // return axios.put(`http://localhost:3200/api/board`, board).then(res => res.data)
      } else {
         // return storageService.post(KEY, board)
         const savedBoard = await httpService.post(`board`, board)
         // const savedBoard = await boardToSave
         // console.log('from service boardToSave', boardToSave);
         return savedBoard
         // return axios.get(`/api/board/add?${queryParams}`).then(res => res.data)
      }
   } catch (err) {
      console.log('Error:', err);
   }
}

async function addActivity(activity, boardId) {
   try {
      const board = await getById(boardId)
      board.activities.push(activity)
      return save(board)
   } catch (err) {
      console.log('Error:', err);
   }
}

//Group
async function removeGroup(groupId, boardId) {
   try {
      const board = await getById(boardId)
      const idx = board.groups.findIndex(group => group.id === groupId)
      board.groups.splice(idx, 1)
      return await save(board)
   } catch (err) {
      console.log('Error:', err);
   }
}

async function saveGroup(group, boardId) {
   try {
      console.log('save', group, 'in board:', boardId);
      const board = await getById(boardId)
      if (group.id) {
         const groupIdx = board.groups.findIndex(currGroup => currGroup.id === group.id)
         board.groups.splice(groupIdx, 1, group)
      } else {
         group.id = utilService.makeId()
         board.groups.push(group)
      }
      await save(board)
      return group
   } catch (err) {
      console.log('Error:', err);
   }
}

async function getGroupById(groupId, boardId) {
   try {
      const board = await getById(boardId)
      return board.groups.find(group => group.id === groupId);
   } catch (err) {
      console.log('Error:', err);
   }
}
//Card
async function removeCard(cardId, groupId, boardId) {
   try {
      const board = await getById(boardId)
      const groupIdx = board.groups.findIndex(group => group.id === groupId)
      const cardIdx = board.groups[groupIdx].cards.findIndex(card => card.id === cardId)
      board.groups[groupIdx].cards.splice(cardIdx, 1)
      // return Promise.reject('balagan')
      return await save(board)
   } catch (err) {
      console.log('Error:', err);
   }
}

async function saveCard(card, groupId, boardId) {
   try {
      const board = await getById(boardId)
      const groupIdx = board.groups.findIndex(group => group.id === groupId)
      if (card.id) {
         const cardIdx = board.groups[groupIdx].cards.findIndex(currCard => currCard.id === card.id)
         board.groups[groupIdx].cards.splice(cardIdx, 1, card)
      } else {
         card.id = utilService.makeId()
         card.createdAt = Date.now()
         // card.byMember = userService.getMiniUser(userService.getLoggedinUser()._id)
         board.groups[groupIdx].cards.push(card)
      }
      await save(board)
      return card
   } catch (err) {
      console.log('Error:', err);
   }
}

async function getCardById(cardId, groupId, boardId) {
   try {
      const board = await getById(boardId)
      const group = board.groups.find(group => group.id === groupId);
      return group.cards.find(card => card.id === cardId);
   } catch (err) {
      console.log('Error:', err);
   }
}
//checklist
async function addCheckbox(commentTxt,checklistId, card, groupId, boardId) {
   try {
      const todo = {
         id:utilService.makeId(),
         title:commentTxt,
         isDone:false
      }
      const currChecklistIdx = card.checklists.findIndex(cl => cl.id === checklistId)
      card.checklists[currChecklistIdx].todos.push(todo);
     return saveCard(card, groupId, boardId)
   } catch (err) {
      console.log('Error:', err);
   }
}
async function removeChecklist(checklistId, card, groupId, boardId) {
   try {
      const currChecklistIdx = card.checklists.findIndex(cl => cl.id === checklistId)
      card.checklists.splice(currChecklistIdx,1);
     return saveCard(card, groupId, boardId)
   } catch (err) {
      console.log('Error:', err);
   }
}
async function removeCheckbox(checkboxId,checklistId, card, groupId, boardId) {
   try {
      const currChecklistIdx = card.checklists.findIndex(cl => cl.id === checklistId)
      const currCheckboxId = card.checklists[currChecklistIdx].todos
         .findIndex(cb => cb.id === checkboxId)
      card.checklists[currChecklistIdx].todos.splice(currCheckboxId, 1);
     return saveCard(card, groupId, boardId)
   } catch (err) {
      console.log('Error:', err);
   }
}

//Comment
async function addComment(commentTxt, card, groupId, boardId) {
   try {
      const comment = {
         id: utilService.makeId(),
         txt: commentTxt,
         createdAt: Date.now(),
         byMember: await userService.getMiniUser(userService.getLoggedinUser()._id)
      }
      card.comments.unshift(comment);
      const savedCard = await saveCard(card, groupId, boardId)
      console.log('savedCard', savedCard)
      return comment
   } catch (err) {
      console.log('Error:', err);
   }
}

async function removeComment(commentId, card, groupId, boardId) {
   try {
      const commentIdx = card.comments.findIndex(comment => comment.id === commentId)
      card.comments.splice(commentIdx, 1)
      saveCard(card, groupId, boardId)
   } catch (err) {
      console.log('Error:', err);
   }
}

//Base
function getEmptyBoard() {
   return {
      title: "",
      isStarred: false,
      style: {},
      labels: [],
      members: [],
      groups: [],
      activities: []
   }
}

function getEmptyGroup() {
   return {
      title: "",
      cards: [],
      style: {}
   }
}

function getEmptyCard() {
   return {
      title: "",
      description: "",
      comments: [],
      checklists: [],
      members: [],
      labelIds: [],
      dueDate: null,
      byMember: {},
      cover: {},
      attachments: [],
      style: {}
   }
}

// function _createDemoBoard() {
//    return {
//       _id: "b101",
//       title: "Robot dev proj",
//       isStarred: true,
//       createdAt: 1589983468418,
//       createdBy: {
//          _id: "u101",
//          fullname: "Abi Abambi",
//          username: "Abi",
//          imgUrl: "http://some-img",
//       },
//       style: { 'background-color': '', 'background-image': 'url(https://wallpaperaccess.com/full/109672.jpg)' },
//       labels: [
//          {
//             id: "l101",
//             title: "Done",
//             color: "#61bd4f",
//          },
//          {
//             id: "l102",
//             title: "Or",
//             color: "#f2d600",
//          },
//          {
//             id: "l103",
//             title: "aaa",
//             color: "#ff9f1a",
//          },
//          {
//             id: "l104",
//             title: "Nice to have",
//             color: "#eb5a46",
//          },
//          {
//             id: "l105",
//             title: "",
//             color: "#c377e0",
//          },
//          {
//             id: "l106",
//             title: "",
//             color: "#0079bf",
//          },
//       ],
//       members: [
//          {
//             _id: "u101",
//             fullname: "Tal Tarablus",
//             username: "Tal",
//             imgUrl: "https://www.google.com",
//          },
//       ],
//       groups: [
//          {
//             id: "g101",
//             title: "Group 1",
//             cards: [
//                {
//                   id: "c101",
//                   title: "Replace logo",
//                   description: "cc1",
//                   comments: [],
//                   checklists: [],
//                   members: [],
//                   labelIds: [],
//                   dueDate: null,
//                   byMember: {
//                      _id: "u101",
//                      username: "Tal",
//                      fullname: "Tal Tarablus",
//                      imgUrl:
//                         "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
//                   },
//                   cover: {},
//                   attachments: [],
//                   style: {}
//                },
//                {
//                   id: "c102",
//                   title: "Add Samples",
//                   description: "",
//                   comments: [],
//                   checklists: [],
//                   members: [],
//                   labelIds: [],
//                   dueDate: null,
//                   byMember: {
//                      _id: "u101",
//                      username: "Tal",
//                      fullname: "Tal Tarablus",
//                      imgUrl:
//                         "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
//                   },
//                   cover: {},
//                   attachments: [],
//                   style: {}
//                },
//             ],
//             style: {},
//          },
//          {
//             id: "g102",
//             title: "Group 2",
//             cards: [
//                {
//                   id: "c103",
//                   title: "Do that",
//                   description: "",
//                   comments: [],
//                   checklists: [],
//                   members: [],
//                   labelIds: [],
//                   dueDate: null,
//                   byMember: {
//                      _id: "u101",
//                      username: "Tal",
//                      fullname: "Tal Tarablus",
//                      imgUrl:
//                         "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
//                   },
//                   cover: {},
//                   attachments: [],
//                   style: {}
//                },
//                {
//                   id: "c104",
//                   title: "Help me",
//                   description: "description",
//                   comments: [
//                      {
//                         id: "ZdPnm",
//                         txt: "also @yaronb please CR this",
//                         createdAt: 1590999817436.0,
//                         byMember: {
//                            _id: "u101",
//                            username: "Tal",
//                            fullname: "Tal Tarablus",
//                            imgUrl:
//                               "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
//                         },
//                      },
//                   ],
//                   checklists: [
//                      {
//                         id: "YEhmF",
//                         title: "Checklist",
//                         todos: [
//                            {
//                               id: "212jX",
//                               title: "To Do 1",
//                               isDone: false,
//                            },
//                         ],
//                      },
//                   ],
//                   members: [
//                      {
//                         _id: "u101",
//                         username: "Tal",
//                         fullname: "Tal Tarablus",
//                         imgUrl:
//                            "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
//                      },
//                   ],
//                   labelIds: ["101"],
//                   createdAt: 1590999730348,
//                   dueDate: 16156215211,
//                   byMember: {
//                      _id: "u101",
//                      username: "Tal",
//                      fullname: "Tal Tarablus",
//                      imgUrl:
//                         "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
//                   },
//                   cover: {},
//                   attachments: [],
//                   style: {
//                      bgColor: "#26de81",
//                   },
//                },
//             ],
//             style: {},
//          },
//       ],
//       activities: [
//          {
//             id: "a101",
//             txt: "Changed Color",
//             createdAt: 154514,
//             byMember: {
//                _id: "u101",
//                username: "Abi",
//                fullname: "Abi Abambi",
//                imgUrl: "http://some-img",
//             },
//             card: {
//                id: "c101",
//                title: "Replace Logo",
//             },
//          },
//       ],
//    }
// }
