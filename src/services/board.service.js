import { storageService } from "./storage.service.js";
// import { utilService } from "./util-service.js";
// import axios from 'axios'
import { httpService } from './http.service.js'
const KEY = 'boards'


export const boardService = {
    query,
    remove,
    save,
    getEmptyBoard,
    getById,
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
            console.log('from service boardToSave', boardToSave);
            // return boardToSave
            // return axios.get(`/api/board/add?${queryParams}`).then(res => res.data)
        }

    } catch (err) {
        console.log('Error:', err);
    }
}


function getEmptyBoard() {
    return {
        // _id: null,
        name: '',
        price: null,
        type: '',
        // createdAt: null,
        inStock: ''
    }
}


// async function addReview(review) {  
//     const reviewToSave = await httpService.post('review', review)
//     return reviewToSave
// }