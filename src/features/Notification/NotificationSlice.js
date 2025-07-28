import { createSlice } from "@reduxjs/toolkit";

const NotificationSlice = createSlice({
    name: 'notification',
    initialState: {
        unreadMsg: [],
        readMsg: []
    },
    reducers: {
        // actions.payload = 
        //     {
        //         _id: ObjectID(),
        //         timestamp: datetime()
        //         is_read: Boolean(),
        //         messageType: str(),
        //         message: str()
        //     }
        insertFrontUnreadMsg: (state, actions) => {
            let payload = actions.payload
            state.unreadMsg.unshift(payload)
        },
        insertBackUnreadMsg: (state, actions) => {
            let payload = actions.payload
            state.unreadMsg.push(payload)
        },
        insertBackReadMsg: (state, actions) => {
            let payload = actions.payload
            state.readMsg.push(payload)
        },
        TransAllUnreadToRead: (state) => {
            state.unreadMsg.forEach((item) => {
                item.is_read = true
            })
            state.readMsg.unshift(...state.unreadMsg)
            state.unreadMsg = []
        }
    }
})
export const { insertFrontUnreadMsg, insertBackUnreadMsg,
    insertBackReadMsg,
    TransAllUnreadToRead
 } = NotificationSlice.actions
export default NotificationSlice.reducer