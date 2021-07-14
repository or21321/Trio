import { boardService } from '@/services/board.service.js'

export const boardStore = {
   state: {
      boards: [],
      currBoard: null,
   },
   getters: {
      boards({ boards }) { return boards },
      currBoard({ currBoard }) { return currBoard }
   },
   mutations: {
      setCurrBoard(state, { board }) {
         state.currBoard = board
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
      },
      removeBoard(state, { boardId }) {
         const idx = state.boards.findIndex(board => board._id === boardId)
         state.boards.splice(idx, 1);
      },
      addActivity(state, { activity, boardId }) {
         const idx = state.boards.findIndex(board => board._id === boardId)
         state.boards[idx].activity.push(activity)
      },
      saveCard(state, { isUpdate, card, groupId}) {
         // const board = state.boards.find(board => board._id === boardId)
         const groupIdx = state.currBoard.groups.findIndex(group => group.id === groupId)
         if (isUpdate) {
            const cardIdx = state.currBoard.groups[groupIdx].cards.findIndex(currCard => currCard.id === card.id)
            state.currBoard.groups[groupIdx].cards.splice(cardIdx, 1, card)
         } else {
            state.currBoard.groups[groupIdx].cards.push(card)
         }
      },
      saveGroup(state, { isUpdate, group }) {
         // const board = state.boards.find(board => board._id === boardId)
         if (isUpdate) {
            const groupIdx = state.currBoard.groups.findIndex(currGroup => currGroup.id === group.id)
            state.currBoard.groups.splice(groupIdx, 1, group)
         } else {
            console.log('commiting group', group, isUpdate);
            state.currBoard.groups.push(group)
         }
      },
   },
   actions: {
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
      async addActivity({ commit }, { activity, boardId }) {
         try {
            await boardService.addActivity(activity, boardId);
            commit({ type: 'addActivity', activity, boardId })
         } catch (err) {
            console.log('Cannot add activity ', activity, ',', err);
            throw err;
         }
      },
      async saveGroup({ commit }, { group, boardId }) {
         const isUpdate = (group.id) ? true : false;
         try {
            const savedGroup = await boardService.saveGroup(group, boardId);
            console.log('fk me lf', savedGroup);
            commit({ type: 'saveGroup', isUpdate, group: savedGroup });
         } catch (err) {
            console.log('Cannot save card', group, ',', err);
            throw err;
         }
      },
      async saveCard({ commit }, { card, groupId, boardId }) {
         console.log('from store', card, groupId, boardId);
         const isUpdate = (card.id) ? true : false;
         try {
            console.log('from store', card, groupId, boardId);
            const savedCard = await boardService.saveCard(card, groupId, boardId);
            console.log('savedCard from store after save', savedCard);
            commit({ type: 'saveCard', isUpdate, card: savedCard, groupId });
            
         } catch (err) {
            console.log('Cannot save card', card, ',', err);
            throw err;
         }
      },
      async getCardById(context, { cardId, groupId, boardId }) {
         try {
            return boardService.getCardById(cardId, groupId, boardId)
         } catch (err) {
            console.log('Cannot save card', cardId, ',', err);
            throw err;
         }
      }
   }
}