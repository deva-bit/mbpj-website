import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from './user.types'

export type UserState = {
    user: User
}

const initialState: UserState = {
    user: {
        name: '',
        email:'',
        authentication:false
    }
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },    
    }
})

export const { setUsers } = userSlice.actions

export default userSlice.reducer
