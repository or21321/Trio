import { storageService } from "./storage.service.js";
// import { userService } from "./user.service.js";
import { utilService } from "./util.service.js";
// import axios from 'axios'
// import { httpService } from './http.service.js'
const KEY = 'boards'


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
   getCardById
   // addReview
}

async function query() {
   try {
      var boards = await storageService.query(KEY)
      if (!boards.length || !boards[0].groups.length) {
         const board = _createDemoBoard()
         await save(board);
      }
      return boards
      // console.log('from query filterBy', filterBy);
      // const boards = await httpService.get('board', filterBy)
      // console.log('from query', boards);
      // return boards

   } catch (err) {
      console.log('query had an error', err);
   }
}

async function getById(boardId) {
   try {
      return storageService.get(KEY, boardId)
      // const board = await httpService.get(`board/${boardId}`)
      // return board
   } catch (err) {
      console.log('Error:', err);
   }
   // return axios.get(`http://localhost:3200/api/board/${boardId}`).then(res => res.data)
}

async function remove(boardId) {
   try {
      return storageService.remove(KEY, boardId)
      // console.log('from service', boardId);
      // return httpService.delete(`board/${boardId}`)
   } catch (err) {
      console.log('Error:', err);
   }
   // return axios.get(`/api/board/${boardId}/remove`).then(res => res.data)
   // return axios.delete(`http://localhost:3200/api/board/${boardId}`)
}

async function save(board) {
   try {
      console.log('save', board);
      // var queryParams = `vendor=${board.vendor}&maxSpeed=${board.maxSpeed}`
      if (board._id) {
         // queryParams += `&_id=${board._id}`
         return storageService.put(KEY, board)
         // const boardToSave = httpService.put(`board`, board)
         // const savedBoard = await boardToSave
         // return savedBoard
         // return axios.put(`http://localhost:3200/api/board`, board).then(res => res.data)
      } else {
         return storageService.post(KEY, board)
         // const boardToSave = await httpService.post(`board`, board)
         // const savedBoard = await boardToSave
         // console.log('from service boardToSave', boardToSave);
         // return boardToSave
         // return axios.get(`/api/board/add?${queryParams}`).then(res => res.data)
      }
   } catch (err) {
      console.log('Error:', err);
   }
}

async function removeGroup(groupId, boardId) {
   try {
      const board = await getById(boardId)
      const idx = board.groups.findIndex(group => group.id === groupId)
      board.groups.splice(idx, 1)
      return storageService.save(KEY, boardId)
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
         return group
      }
      await save(board)
      return group
   } catch (err) {
      console.log('Error:', err);
   }
}

async function removeCard(cardId, groupId, boardId) {
   try {
      const board = await getById(boardId)
      const groupIdx = board.groups.findIndex(group => group.id === groupId)
      const cardIdx = board.groups[groupIdx].cards.findIndex(card => card.id === cardId)
      board.groups[groupIdx].cards.splice(cardIdx, 1)
      return storageService.save(KEY, boardId)
   } catch (err) {
      console.log('Error:', err);
   }
}

async function saveCard(card, groupId, boardId) {
    try {
        console.log('save', card, 'in group:', groupId, 'in board:', boardId);
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
        // console.log('from service save', card);
        return card
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

async function getCardById(cardId, groupId, boardId) {
   try {
      const board = await getById(boardId)
      const group = board.groups.find(group => group.id === groupId);
      console.log('group', group)
      return group.cards.find(card => card.id === cardId);
   } catch (err) {
      console.log('Error:', err);
   }
}

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
      style: {}
   }
}

function _createDemoBoard() {
  return {
        _id: "b101",
        title: "Robot dev proj",
        createdAt: 1589983468418,
        createdBy: {
          _id: "u101",
          fullname: "Abi Abambi",
          imgUrl: "http://some-img",
        },
        style: {},
        labels: [
          {
            id: "l101",
            title: "Done",
            color: "#61bd4f",
          },
        ],
        members: [
          {
            _id: "u101",
            fullname: "Tal Tarablus",
            imgUrl: "https://www.google.com",
          },
        ],
        groups: [
          {
            id: "g101",
            title: "Group 1",
            cards: [
              {
                id: "c101",
                title: "Replace logo",
              },
              {
                id: "c102",
                title: "Add Samples",
              },
            ],
            style: {},
          },
          {
            id: "g102",
            title: "Group 2",
            cards: [
              {
                id: "c103",
                title: "Do that",
              },
              {
                id: "c104",
                title: "Help me",
                description: "description",
                comments: [
                  {
                    id: "ZdPnm",
                    txt: "also @yaronb please CR this",
                    createdAt: 1590999817436.0,
                    byMember: {
                      _id: "u101",
                      fullname: "Tal Tarablus",
                      imgUrl:
                        "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
                    },
                  },
                ],
                checklists: [
                  {
                    id: "YEhmF",
                    title: "Checklist",
                    todos: [
                      {
                        id: "212jX",
                        title: "To Do 1",
                        isDone: false,
                      },
                    ],
                  },
                ],
                members: [
                  {
                    _id: "u101",
                    username: "Tal",
                    fullname: "Tal Tarablus",
                    imgUrl:
                      "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
                  },
                ],
                labelIds: ["101"],
                createdAt: 1590999730348,
                dueDate: 16156215211,
                byMember: {
                  _id: "u101",
                  username: "Tal",
                  fullname: "Tal Tarablus",
                  imgUrl:
                    "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg",
                },
                style: {
                  bgColor: "#26de81",
                },
              },
            ],
            style: {},
          },
        ],
        activities: [
          {
            id: "a101",
            txt: "Changed Color",
            createdAt: 154514,
            byMember: {
              _id: "u101",
              fullname: "Abi Abambi",
              imgUrl: "http://some-img",
            },
            card: {
              id: "c101",
              title: "Replace Logo",
            },
          },
        ],
      }
}

// async function addReview(review) {  
//     const reviewToSave = await httpService.post('review', review)
//     return reviewToSave
// }