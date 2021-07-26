import io from 'socket.io-client'

export const SOCKET_EMIT_USER_WATCH = 'user-watch';
export const SOCKET_EMIT_BOARD_WATCH = 'currBoard'
export const SOCKET_EMIT_BOARD_UPDATE = 'board update'
export const SOCKET_ON_BOARD_UPDATE = 'board updated'
export const SOCKET_EVENT_USER_UPDATED = 'user-updated';


const baseUrl = (process.env.NODE_ENV === 'production') ? '' : '//localhost:3030'
export const socketService = createSocketService()

window.socketService = socketService


function createSocketService() {
    var socket = null;
    const socketService = {
        async setup() {
            socket = io(baseUrl)
        },
        on(eventName, cb) {
            socket.on(eventName, cb)
        },
        off(eventName, cb = null) {
            if (!socket) return;
            if (!cb) socket.removeAllListeners(eventName)
            else socket.off(eventName, cb)
        },
        emit(eventName, data) {
            socket.emit(eventName, data)
        },
        terminate() {
            socket = null
        }
    }
    return socketService
}

