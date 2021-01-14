import { createStore } from 'vuex'

export default createStore({
  state: {
    currentPlayTime: 0,
  },
  mutations: {
    changecurrentPlayTime(state, currentTime) {
      state.currentPlayTime = currentTime
    }
  },
  actions: {
    currentPlayTime: state => state.currentPlayTime
  },
  modules: {
  }
})
