import { createSlice } from '@reduxjs/toolkit';
import { FaUser } from 'react-icons/fa';

// Define the initial state
const initialState = {
    icon: <FaUser style={{ marginRight: "8px" }} />,
    title: 'default',
};

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        setLayoutData: (state, action) => {
            Object.assign(state, action.payload);
        }
    },
});

export default layoutSlice.reducer;
export const { setLayoutData } = layoutSlice.actions;


