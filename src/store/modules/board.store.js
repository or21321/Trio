import { boardService } from '@/services/board.service.js'
import { socketService } from '@/services/socket.service'
import { SOCKET_ON_BOARD_UPDATE } from '@/services/socket.service'
// import Vue from 'vue'

export const boardStore = {
   state: {
      boards: [],
      currBoard: null,
      recentBoards: [],
      cardEdit: null,
      filterBy: {
         txt: '',
         labelIds: [],
         memberIds: [],
         timeLeft: 0
      }
   },
   getters: {
      boards({ boards }) { return boards },
      filterBy({ filterBy }) { return filterBy },
      currBoard({ currBoard, filterBy }) {

         if (!currBoard) return 
         if (!filterBy.txt && !filterBy.labelIds.length && !filterBy.memberIds.length && !filterBy.timeLeft) {
            return currBoard;
         }
         var boardForDisplay = JSON.parse(JSON.stringify(currBoard))
         
         boardForDisplay.groups.forEach(g => {

            if (filterBy.txt) {
               let regex = new RegExp(filterBy.txt, 'i')
               g.cards = g.cards.filter(c => regex.test(c.title))
            }

            if (filterBy.labelIds.length) {
               g.cards = g.cards.filter(c => {
                  return c.labelIds.some(labelId => {
                     return filterBy.labelIds.some(lId => lId === labelId)
                  })
               })
            }

            if (filterBy.memberIds.length) {
               g.cards = g.cards.filter(c => {
                  return c.members.some(member => {
                     return filterBy.memberIds.some(mId => {
                        return mId === member._id
                     })
                  })
               })
            }

            console.log('filterBy.timeLeft', filterBy.timeLeft)
            if (filterBy.timeLeft) {
               g.cards = g.cards.filter(c => {
                  return (Date.parse(c.dueDate.time) - Date.now() < filterBy.timeLeft &&
                     Date.parse(c.dueDate.time) > (Date.now() - 1000 * 60 * 60 * 24))
               })
            }

         })
         return boardForDisplay

      },
      recentBoards({ recentBoards }) { return recentBoards },
      cardEdit({ cardEdit }) { return cardEdit },
      boardsToShow(state) {
         let regex = new RegExp(state.filterBy.txt, 'i')
         return state.boards.filter(board => {
            return regex.test(board.title)
         })
      },
   },
   mutations: {
      // Board
      setFilterBy(state, { filterBy }) {
         state.filterBy = filterBy
      },
      setCurrBoard(state, { board }) {
         console.log('Yeafgf', board);
         socketService.on(SOCKET_ON_BOARD_UPDATE, board => {
            console.log('FROM STORE FROM SOCKET', board);
            state.currBoard = board
         })
         console.log('board', board);
         state.currBoard = board
      },
      setCardEdit(state, { card }) {
         state.cardEdit = card
      },
      loadBoards(state, { boards }) {
         state.boards = boards
      },
      addBoard(state, { savedBoard }) {
         state.boards.push(savedBoard);
      },
      updateBoard(state, { savedBoard }) {
         const idx = state.boards.findIndex(board => board._id === savedBoard._id)
         state.boards.splice(idx, 1, savedBoard)
         state.currBoard = savedBoard
      },
      removeBoard(state, { boardId }) {
         const idx = state.boards.findIndex(board => board._id === boardId)
         state.boards.splice(idx, 1);
      },
      addActivity(state, { activity }) {
         state.currBoard.activities.push(activity)
      },
      addBoardToRecentBoards(state, { board }) {
         if (state.recentBoards.length >= 5) state.recentBoards.pop()
         state.recentBoards = state.recentBoards.filter(currBoard =>
            currBoard._id !== board._id)
         state.recentBoards.unshift(board)
      },
      removeBoardFromRecentBoards(state, { board }) {
         if (state.recentBoards.length === 0) return
         state.recentBoards = state.recentBoards.filter(currBoard =>
            currBoard._id !== board._id)
      },
      //Group
      saveGroup(state, { isUpdate, group }) {
         if (isUpdate) {
            const groupIdx = state.currBoard.groups.findIndex(g => g.id === group.id)
            state.currBoard.groups.splice(groupIdx, 1, group)
         } else {
            state.currBoard.groups.push(group)
         }
      },
      // Card
      saveCard(state, { isUpdate, card, groupId }) {
         const groupIdx = state.currBoard.groups.findIndex(group => group.id === groupId)
         if (isUpdate) {
            const cardIdx = state.currBoard.groups[groupIdx].cards.findIndex(c => c.id === card.id)
            state.currBoard.groups[groupIdx].cards.splice(cardIdx, 1, card)
         } else {
            state.currBoard.groups[groupIdx].cards.push(card)
         }
      },
      addComment(state, { savedComment, card, groupId }) {
         const groupIdx = state.currBoard.groups.findIndex(g => g.id === groupId)
         const cardIdx = state.currBoard.groups[groupIdx].cards.findIndex(c => c.id === card.id)
         state.currBoard.groups[groupIdx].cards[cardIdx].comments.unshift(savedComment)
      }
   },
   actions: {
      //Board
      async saveBoardAfterDrag({ commit,state }, { board }) {
         const {filterBy} = state
         if (filterBy.txt || filterBy.labelIds.length || filterBy.memberIds.length || filterBy.timeLeft) return Promise.reject()
         try {
            console.log('from store', board);
            const savedBoard = await boardService.save(board)
            commit({ type:'updateBoard', savedBoard })
            return savedBoard
         } catch (err) {
            console.log('Had a problem updating board after drag - cant do that while filtering', err);
            throw err
         }
      },
      async loadBoards({ commit }) {
         try {
            const boards = await boardService.query()
            commit({ type: 'loadBoards', boards })
            return boards
         }
         catch (err) {
            console.log('Cannot load boards', err);
            throw err;
         }
      },
      async loadBoard({ commit }, { boardId }) {
         try {
            const board = await boardService.getById(boardId)
            commit({ type: 'setCurrBoard', board })
            return board
         }
         catch (err) {
            console.log('Cannot load board', err);
            throw err;
         }
      },
      async saveBoard({ commit }, { board }) {
         const type = (board._id) ? 'updateBoard' : 'addBoard';
         try {
            console.log('from store', board);
            const savedBoard = await boardService.save(board)
            commit({ type, savedBoard })
            return savedBoard
         }
         catch (err) {
            console.log('Cannot save board ', board, ',', err);
            throw err;
         }
      },
      async removeBoard({ commit }, { boardId }) {
         try {
            await boardService.remove(boardId)
            commit({ type: 'removeBoard', boardId })
         }
         catch (err) {
            console.log('Cannot remove board ', boardId, ',', err);
            throw err;
         }
      },
      async getBoardById(context, { boardId }) {
         try {
            return await boardService.getById(boardId)
         } catch (err) {
            console.log('Cannot get board', boardId, ',', err);
            throw err;
         }
      },
      async addActivity(context, { activity }) {
         try {
            const boardId = context.state.currBoard._id
            const newActivity = await boardService.addActivity(activity, boardId);
            context.commit({ type: 'addActivity', activity: newActivity, boardId })
         } catch (err) {
            console.log('Cannot add activity ', activity, ',', err);
            throw err;
         }
      },
      // Group
      async saveGroup({ commit }, { group, boardId }) {
         const isUpdate = (group.id) ? true : false;
         try {
            const savedGroup = await boardService.saveGroup(group, boardId);
            commit({ type: 'saveGroup', isUpdate, group: savedGroup });
         } catch (err) {
            console.log('Cannot save group', group, ',', err);
            throw err;
         }
      },
      async removeGroup({ commit }, { groupId, boardId }) {
         try {
            const savedBoard = await boardService.removeGroup(groupId, boardId);
            commit({ type: 'updateBoard', savedBoard });
         } catch (err) {
            console.log('Cannot remove group', groupId, ',', err);
            throw err;
         }
      },
      async getGroupById(context, { groupId, boardId }) {
         try {
            return boardService.getGroupById(groupId, boardId)
         } catch (err) {
            console.log('Cannot get group', groupId, ',', err);
            throw err;
         }
      },
      // Card
      async saveCard({ commit }, { card, groupId, boardId }) {
         const isUpdate = (card.id) ? true : false;
         try {
            const savedCard = await boardService.saveCard(card, groupId, boardId);
            commit({ type: 'saveCard', isUpdate, card: savedCard, groupId });
            return savedCard;
         } catch (err) {
            console.log('Cannot save card', card, ',', err);
            throw err;
         }
      },
      async removeCard({ commit }, { cardId, groupId, boardId }) {
         try {
            const savedBoard = await boardService.removeCard(cardId, groupId, boardId)
            commit({ type: 'updateBoard', savedBoard })
         }
         catch (err) {
            console.log('Cannot remove card ', cardId, ',', err);
            throw err;
         }
      },
      async getCardById(context, { cardId, groupId, boardId }) {
         try {
            const card = await boardService.getCardById(cardId, groupId, boardId)
            return card
         } catch (err) {
            console.log('Cannot get card', cardId, ',', err);
            throw err;
         }
      },
      //Checkbox
      async addCheckbox({ commit}, { title, checklistId, card, groupId, boardId }) {
         try {
            const savedCard = await boardService.addCheckbox(title, checklistId, card, groupId, boardId)
            commit({ type: 'saveCard', isUpdate: true, card: savedCard, groupId })
            return savedCard
         } catch (err) {
            console.log('Cannot add checkbox', title, ',', err);
            throw err;
         }
      },
      async removeChecklist(context, { checklistId, card, groupId, boardId }) {
         try {
            boardService.removeChecklist(checklistId, card, groupId, boardId)
         } catch (err) {
            console.log('Cannot remove checklist', checklistId, ',', err);
            throw err;
         }
      },
      async removeCheckbox(context, { checkboxId, checklistId, card, groupId, boardId }) {
         try {
            boardService.removeCheckbox(checkboxId, checklistId, card, groupId, boardId)
         } catch (err) {
            console.log('Cannot remove checklist', checklistId, ',', err);
            throw err;
         }
      },
      //Comment
      async addComment(context, { commentTxt, card, groupId, boardId }) {
         try {
            const savedComment = await boardService.addComment(commentTxt, card, groupId, boardId)
            context.commit({ type: 'addComment', savedComment, card, groupId })
         } catch (err) {
            console.log('Cannot add comment', commentTxt, ',', err);
            throw err;
         }
      },
      async removeComment(context, { commentId, card, groupId, boardId }) {
         try {
            const savedCard = await boardService.removeComment(commentId, card, groupId, boardId)
            console.log('savedCard after removeComment', savedCard);
            return savedCard
            // commit({type:'removeComment', })
         }
         catch (err) {
            console.log('Cannot remove board ', boardId, ',', err);
            throw err;
         }
      },
      async deleteImgFromCard(context, { commentId, card, groupId, boardId }) {
         try {
            await boardService.removeComment(commentId, card, groupId, boardId)
         }
         catch (err) {
            console.log('Cannot remove board ', boardId, ',', err);
            throw err;
         }
      },
      async copyCard({ commit}, { card, groupId, boardId }) {
         try {
            const newCard = await boardService.copyCard(card, groupId, boardId)
            commit({ type: 'saveCard', isUpdate: false, card: newCard, groupId })
            return newCard;
         } catch (err) {
            console.log('Cannot copy card ', card, ',', err);
            throw err;
         }
      }
   }
}