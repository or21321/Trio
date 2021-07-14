import { boardService } from '@/services/board.service.js'

export const boardStore = {
   state: {
      boards: [],
      currBoardId: null,
   },
   getters: {
      boards({ boards }) { return boards },
      currBoardId({ currBoardId }) { return currBoardId }
   },
   mutations: {
      setCurrBoardId(state, { boardId }) {
         state.CurrBoardId = boardId
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
      saveCard(state, { isUpdate, card, groupId, boardId }) {
         const board = state.boards.find(board => board._id === boardId)
         const group = board.groups.find(group => group.id === groupId)
         if (isUpdate) {
            const cardIdx = group.cards.findIndex(currCard => currCard.id === card.id)
            group.cards.splice(cardIdx, 1, card)
         } else {
            group.cards.push(card)
         }
      },
      saveGroup(state, { isUpdate, group, boardId }) {
         const board = state.boards.find(board => board._id === boardId)
         if (isUpdate) {
            const groupIdx = board.groups.findIndex(currGroup => currGroup.id === group.id)
            board.groups.splice(groupIdx, 1, group)
         } else {
            board.groups.push(group)
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
            commit({ type: 'setCurrBoardId', boardId })
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
      async setCurrBoardId({ commit }, { boardId }) {
         try {
            const board = await boardService.getById(boardId);
            commit({ type: 'setCurrBoardId', board })
         } catch (err) {
            console.log('Cannot get board ', boardId, ',', err);
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
         const isUpdate = (group._id) ? true : false;
         try {
            const savedGroup = await boardService.saveGroup(group, boardId);
            commit({ type: 'saveGroup', isUpdate, savedGroup, boardId });
         } catch (err) {
            console.log('Cannot save card', group, ',', err);
            throw err;
         }
      },
      async saveCard({ commit }, { card, groupId, boardId }) {
         const isUpdate = (card._id) ? true : false;
         try {
            const savedCard = await boardService.saveCard(card, groupId, boardId);
            commit({ type: 'saveCard', isUpdate, savedCard, groupId, boardId });
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