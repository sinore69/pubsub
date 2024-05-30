import { createSlice } from "@reduxjs/toolkit"

interface counterstate{
    value:number
}
const initialState:counterstate={
    value:0
}

const counterslice=createSlice({
    name:"counter",
    initialState,
    reducers:{
        increment:(state)=>{
            state.value+=1
        }
    }
})
export const {increment}=counterslice.actions
export default counterslice.reducer