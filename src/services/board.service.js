import { storageService } from "./storage.service.js";
import { userService } from "./user.service.js";
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
    addActivity
    // addReview
}

async function query() {
    try {
        return storageService.query(KEY)
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
            const groupIdx = board.groups.findIndex(group => group.id === groupId)
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
            const cardIdx = board.groups[groupIdx].cards.findIndex(card => card.id === cardId)
            board.groups[groupIdx].cards.splice(cardIdx, 1, card)
        } else {
            card.id = utilService.makeId()
            card.createdAt = Date.now()
            card.byMember = userService.getMiniUser(userService.getLoggedinUser()._id)
            board.groups[groupIdx].cards.push(card)
        }
        await save(board)
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

// async function addReview(review) {  
//     const reviewToSave = await httpService.post('review', review)
//     return reviewToSave
// }