import { createStore } from "vuex";

export default createStore({
	state: {
		colNumber: 0,
		rowNumber: 0,
		moleNumber: 0,
	},
	mutations: {
		update(state, params) {
			state.colNumber = Number(params.colNumber);
			state.rowNumber = Number(params.rowNumber);
			state.moleNumber = Number(params.moleNumber);
		},
	},
	actions: {},
	modules: {},
});
