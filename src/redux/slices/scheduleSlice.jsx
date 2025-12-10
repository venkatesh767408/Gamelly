import { createSlice } from "@reduxjs/toolkit";



const initialState={
    schedules:[],
    createdSchedule:null,
    isLoading:false,
    error:null
}


const scheduleSlice =createSlice({
    name:"schedule",
    initialState,
    reducers:{
        startLoading:(state)=>{
            state.isLoading = true;
            state.error =null
        },

        createScheduleStart:(state)=>{
            state.isLoading = true;
            state.error = null;
        },

        createScheduleSuccess:(state,action)=>{
            state.isLoading=false;
            state.createdSchedule=action.payload;
            state.schedules.push(action.payload);
            state.error = null;
        },

        createScheduleFailure:(state,action)=>{
            state.isLoading = false;
            state.error = action.payload
        },

        getSchedulesByTeamStart:(state)=>{
            state.isLoading = true;
            state.error = null;
        },
        getSchedulesByTeamSuccess:(state,action)=>{
            state.isLoading = false;
            state.schedules = action.payload;
            state.error = null;
        },

        getSchedulesByTeamFailure:(state,action)=>{
            state.isLoading = false;
            state.error = action.payload;
        },

        updateScheduleStart:(state)=>{
            state.isLoading = true;
            state.error = null;
        },

        updateScheduleSuccess:(state,action)=>{
            state.isLoading = false;
            const updatedSchedule = action.payload;


            const index = state.schedules.findIndex(
                (s)=>s.id === updatedSchedule.id || s._id === updatedSchedule._id
            );

            if(index !==-1){
                state.schedules[index] = updatedSchedule
            };

            state.error = null
        },

        updateScheduleFailure:(state,action)=>{
            state.isLoading = false;
            state.error = action.payload;
        },


        deleteScheduleStart:(state)=>{
            state.isLoading = true;
            state.error = null;
        },

        deleteScheduleSuccess:(state,action)=>{
            state.isLoading = false;
            const deletedScheduleId = action.payload;

            state.schedules = state.schedules.filter(
                (s)=>s.id !== deletedScheduleId && s._id !== deletedScheduleId
            );
            state.error = null
        },

        deleteScheduleFailure:(state,action)=>{
            state.isLoading = false;
            state.error = action.payload
        },

        clearError:(state)=>{
            state.error = null
        },
        clearCreatedSchedule:(state)=>{
            state.createdSchedule = null
        },

        clearSchedules:(state)=>{
            state.schedules = []
        }
    }
})

export const {
    startLoading,
    createScheduleStart,
    createScheduleSuccess,
    createScheduleFailure,
    getSchedulesByTeamStart,
    getSchedulesByTeamSuccess,
    getSchedulesByTeamFailure,
    updateScheduleStart,
    updateScheduleSuccess,
    updateScheduleFailure,
    deleteScheduleStart,
    deleteScheduleSuccess,
    deleteScheduleFailure,
    clearError,
    clearCreatedSchedule,
    clearSchedules
} = scheduleSlice.actions

export default scheduleSlice.reducer