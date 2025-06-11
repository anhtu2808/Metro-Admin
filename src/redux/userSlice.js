import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyInfoAPI } from '../apis';


// Async action to fetch user profile data
export const getMyInfo = createAsyncThunk('user/getMyInfo', async () => {
    const response = await getMyInfoAPI();
    return response;
});

// Define the initial state
const initialState = {
    isAuthorized: localStorage.getItem("accessToken") ? true : false,
    id: null,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    fullName: '',
    phone: '',
    avatarUrl: '',
    address: '',
    role: '',
    permissions: [],
    isStudentVerified: false,
    studentVerifications: [],
    isLoading: false,
    isError: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUser: () => {
            return initialState;
        },
        setIsAuthorized: (state, action) => {
            state.isAuthorized = action.payload;
          },
        setUser: (state, action) => {
            Object.assign(state, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMyInfo.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMyInfo.fulfilled, (state, action) => {
            const userData = action.payload.result;
            state.id = userData.id;
            state.username = userData.username;
            state.email = userData.email;
            state.firstName = userData.firstName;
            state.lastName = userData.lastName;
            state.fullName = userData.fullName;
            state.phone = userData.phone;
            state.avatarUrl = userData.avatarUrl;
            state.address = userData.address;
            state.role = userData.role;
            state.permissions = userData.permissions;
            state.isStudentVerified = userData.isStudentVerified;
            state.studentVerifications = userData.studentVerifications;
            state.isLoading = false;
            state.isError = false;
        });
        builder.addCase(getMyInfo.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    },
});

export default userSlice.reducer;
export const { resetUser, setUser, setIsAuthorized } = userSlice.actions;
