import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserRole } from './userRole.types'

export type UserState = {
    userRole: UserRole
}

const initialState: UserState = {
    userRole: {
        name: '',
        email:'',
        roles:[{
            id:0,
            description:"",
            status:true,
            pages:[{
                id:0,
                code:"",
                description:""
            }],
        }],
        status:false,
        adminAuthentication:false
    }
}

const userSlice = createSlice({
    name: 'userRole',
    initialState,
    reducers: {
        setUserRole: (state, action: PayloadAction<UserRole>) => {
            state.userRole = action.payload
        },    
    }
})

export const { setUserRole } = userSlice.actions

export default userSlice.reducer
