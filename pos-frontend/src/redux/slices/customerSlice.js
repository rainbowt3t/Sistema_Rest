import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderId: "",
    customerName: "",
    customerPhone: "",
    guests: 0,
    table: null
}


const customerSlice = createSlice({
    name : "customer",
    initialState,
    reducers : {
        setCustomer: (state, action) => {
            const { name, phone, guests } = action.payload;
            state.orderId = `${Date.now()}`;
            state.customerName = name;
            state.customerPhone = phone;
            state.guests = guests;
        },

        removeCustomer: (state) => {
            state.orderId = "";
            state.customerName = "";
            state.customerPhone = "";
            state.guests = 0;
            state.table = null;
        },

        updateTable: (state, action) => {
            state.table = action.payload.table;
        },

        loadActiveOrder: (state, action) => {
            const { orderId, name, phone, guests, table } = action.payload;
            state.orderId = orderId;
            state.customerName = name;
            state.customerPhone = phone;
            state.guests = guests;
            state.table = table;
        }

    }
})


export const { setCustomer, removeCustomer, updateTable, loadActiveOrder } = customerSlice.actions;
export default customerSlice.reducer;