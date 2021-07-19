import { boardService } from '@/services/board.service.js'

export const boardStore = {
   state: {
      boards: [],
      currBoard: null,
      recentBoards: [],
      filterBy: {
         txt: ''
      }
   },
   getters: {
      boards({ boards }) { return boards },
      currBoard({ currBoard }) { return currBoard },
      recentBoards({ recentBoards }) { return recentBoards },
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
         state.currBoard = board
      },
      loadBoards(state, { boards }) {
         state.boards = boards
      },
      addBoard(state, { savedBoard }) {
         state.boards.unshift(savedBoard);
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
         state.boards[idx].activity.push(activity)
      },
      addBoardToRecentBoards(state, { board }) {
         if (state.recentBoards.length >= 5) state.recentBoards.pop()
         state.recentBoards = state.recentBoards.filter(currBoard =>
            currBoard._id !== board._id)
         state.recentBoards.unshift(board)
      },
      //Group
      saveGroup(state, { isUpdate, group }) {
         if (isUpdate) {
            const groupIdx = state.currBoard.groups.findIndex(currGroup => currGroup.id === group.id)
            state.currBoard.groups.splice(groupIdx, 1, group)
         } else {
            state.currBoard.groups.push(group)
         }
      },
      // Card
      saveCard(state, { isUpdate, card, groupId }) {
         const groupIdx = state.currBoard.groups.findIndex(group => group.id === groupId)
         console.log('groupIdx', groupIdx);
         console.log('card from commit', card);
         if (isUpdate) {
            const cardIdx = state.currBoard.groups[groupIdx].cards.findIndex(c => c.id === card.id)
            console.log('cardIdx', cardIdx);
            state.currBoard.groups[groupIdx].cards.splice(cardIdx, 1, card)
         } else {
            state.currBoard.groups[groupIdx].cards.push(card)
         }
      },
      addComment(state, { savedComment, card, groupId}) {
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
            await boardService.addActivity(activity, boardId);
            commit({ type: 'addActivity', activity, boardId })
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
      async addCheckbox({commit}, { title,checklistId, card, groupId, boardId }) {
         try {
           const savedCard = await boardService.addCheckbox(title,checklistId, card, groupId, boardId)
         //   console.log('savedCard after save', savedCard);
           commit({type:'saveCard', isUpdate:true, card: savedCard, groupId})
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
            console.log('Cannot remove checklist', checklistId , ',', err);
            throw err;
         }
      },
      async removeCheckbox(context, { checkboxId,checklistId, card, groupId, boardId }) {
         try {
           boardService.removeCheckbox(checkboxId,checklistId, card, groupId, boardId)
         } catch (err) {
            console.log('Cannot remove checklist', checklistId , ',', err);
            throw err;
         }
      },
      //Comment
      async addComment(context, { commentTxt, card, groupId, boardId }) {
         try {
            const savedComment = await boardService.addComment(commentTxt, card, groupId, boardId)
            console.log('Ahalan');
            context.commit({ type: 'addComment', savedComment, card, groupId})
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