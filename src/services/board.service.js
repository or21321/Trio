
import { userService } from "./user.service.js";
import { utilService } from "./util.service.js";
import { httpService } from './http.service.js'


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
   copyCard

}

//Board
async function query() {
   try {
      const boards = await httpService.get('board')
      return boards

   } catch (err) {
      console.log('query had an error', err);
   }
}

async function getById(boardId) {
   try {
      const board = await httpService.get(`board/${boardId}`)
      return board
   } catch (err) {
      console.log('Error:', err);
   }
}

async function remove(boardId) {
   try {
      return httpService.delete(`board/${boardId}`)
   } catch (err) {
      console.log('Error:', err);
   }
}

async function save(board) {
   try {
      if (board._id) {
         const savedBoard = await httpService.put(`board`, board)
         return savedBoard
      } else {
         const savedBoard = await httpService.post(`board`, board)
         return savedBoard
      }
   } catch (err) {
      console.log('Error:', err);
   }
}

async function addActivity(activity, boardId) {
   try {
      console.log('recevied activity to board service:', activity)
      activity.id = utilService.makeId()
      activity.createdAt = Date.now()
      const newActivity = await httpService.post(`board/${boardId}/activity`, { boardId, activity })
      return newActivity
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
         console.log('board.groups[groupIdx].cards', board.groups[groupIdx].cards)
         board.groups[groupIdx].cards.splice(cardIdx, 1, card)
      } else {
         card.id = utilService.makeId()
         card.createdAt = Date.now()
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
      const card =  group.cards.find(card => card.id === cardId);
      console.log('cardddd', card)
      return card;
   } catch (err) {
      console.log('Error:', err);
   }
}
//checklist
async function addCheckbox(commentTxt, checklistId, card, groupId, boardId) {
   try {
      const todo = {
         id: utilService.makeId(),
         title: commentTxt,
         isDone: false
      }
      const currChecklistIdx = card.checklists.findIndex(cl => cl.id === checklistId)
      card.checklists[currChecklistIdx].todos.push(todo);
      return await saveCard(card, groupId, boardId)
   } catch (err) {
      console.log('Error:', err);
   }
}
async function removeChecklist(checklistId, card, groupId, boardId) {
   try {
      const currChecklistIdx = card.checklists.findIndex(cl => cl.id === checklistId)
      card.checklists.splice(currChecklistIdx, 1);
      return await saveCard(card, groupId, boardId)
   } catch (err) {
      console.log('Error:', err);
   }
}
async function removeCheckbox(checkboxId, checklistId, card, groupId, boardId) {
   try {
      const currChecklistIdx = card.checklists.findIndex(cl => cl.id === checklistId)
      const currCheckboxIdx = card.checklists[currChecklistIdx].todos
         .findIndex(cb => cb.id === checkboxId)
      card.checklists[currChecklistIdx].todos.splice(currCheckboxIdx, 1);
      return await saveCard(card, groupId, boardId)
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
      console.log('savedCard',savedCard)
      return comment
   } catch (err) {
      console.log('Error:', err);
   }
}

async function removeComment(commentId, card, groupId, boardId) {
   try {
      const commentIdx = card.comments.findIndex(comment => comment.id === commentId)
      card.comments.splice(commentIdx, 1)
      await saveCard(card, groupId, boardId)
   } catch (err) {
      console.log('Error:', err);
   }
}

async function copyCard(card, groupId, boardId) {
   try {
      const newCard = JSON.parse(JSON.stringify(card))
      delete newCard.id;
      return await saveCard(newCard, groupId, boardId)
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
      labels: [
         { color: '#61bd4f', id: utilService.makeId(), title: '' },
         { color: '#f2d600', id: utilService.makeId(), title: '' },
         { color: '#ff9f1a', id: utilService.makeId(), title: '' },
         { color: '#eb5a46', id: utilService.makeId(), title: '' },
         { color: '#c377e0', id: utilService.makeId(), title: '' },
         { color: '#0079bf', id: utilService.makeId(), title: '' },
      ],
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
      dueDate: {},
      byMember: {},
      cover: { color: '', type: '' },
      attachments: [],
      style: {}
   }
}