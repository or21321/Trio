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
      }
   },
   getters: {
      boards({ boards }) { return boards },
      currBoard({ currBoard, filterBy }) {
         console.log('filterBy', filterBy);

         var boardForDisplay = JSON.parse(JSON.stringify(currBoard))
         if (filterBy.txt) {
            boardForDisplay.groups.map(g => {
               let regex = new RegExp(filterBy.txt, 'i')
               g.cards = g.cards.filter(c => regex.test(c.title))
               return g
            })
         }

         if (filterBy.labelIds.length) {
            boardForDisplay.groups.map(g => {
               g.cards = g.cards.filter(c => {
                  return c.labelIds.some(labelId => {  
                     return filterBy.labelIds.some(lId => lId === labelId)
                  })
               })
               return g
            })
         }

         if (filterBy.memberIds.length) { 
            boardForDisplay.groups.map(g => {
               g.cards = g.cards.filter(c => {
                  console.log('c.members', c.members);
                  return c.members.some(member => {  
                     console.log('member', member);
                     return filterBy.memberIds.some(mId => mId === member.id)
                  })
               })
               return g
            })
         }
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
         socketService.on(SOCKET_ON_BOARD_UPDATE, board => {
            socketService.on(SOCKET_ON_BOARD_UPDATE, board => {
               console.log('FROM STORE FROM SOCKET', board);
               state.currBoard = board
            })
            state.currBoard = board
         });
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
      addActivity(state, { activity, boardId }) {
         const idx = state.boards.findIndex(board => board._id === boardId)
         state.boards[idx].activities.unshift(activity)
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
            // Vue.set(state.currBoard.groups[groupIdx].cards, cardIdx, card)
         } else {
            state.currBoard.groups[groupIdx].cards.push(card)
            console.log('ahalan', state.currBoard.groups[groupIdx].cards);
            // Vue.set(state.currBoard.groups[groupIdx].cards, state.currBoard.groups[groupIdx].cards.length - 1, card)
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
      async addActivity({ commit }, { activity, boardId }) {
         try {
            const newActivity = await boardService.addActivity(activity, boardId);
            commit({ type: 'addActivity', activity: newActivity, boardId })
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
            console.log('saveCard', card);
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
            return await boardService.getCardById(cardId, groupId, boardId)
         } catch (err) {
            console.log('Cannot get card', cardId, ',', err);
            throw err;
         }
      },
      //Checkbox
      // async addCheckbox({commit}, { title,checklistId, card, groupId, boardId }) {
      async addCheckbox({ commit }, { title, checklistId, card, groupId, boardId }) {
         try {
            const savedCard = await boardService.addCheckbox(title, checklistId, card, groupId, boardId)
            //   console.log('savedCard after save', savedCard);
            commit({ type: 'saveCard', isUpdate: true, card: savedCard, groupId })
            //   console.log('savedCard', savedCard);
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
            console.log('Ahalan');
            context.commit({ type: 'addComment', savedComment, card, groupId })
         } catch (err) {
            console.log('Cannot add comment', commentTxt, ',', err);
            throw err;
         }
      },
      async removeComment(context, { commentId, card, groupId, boardId }) {
         try {
            await boardService.removeComment(commentId, card, groupId, boardId)
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
   }
}