import { createSlice } from "@reduxjs/toolkit"

const DesktopNotificationSlice = createSlice({
    name: 'desktopNotification',
    initialState: {
        permission: 'default'
    },
    reducers: {
        setPermission: (state, actions) => {
            state.permission = actions.payload
        }
    }
})

export const { setPermission } = DesktopNotificationSlice.actions
export default DesktopNotificationSlice.reducer