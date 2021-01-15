import { createStore } from 'vuex'

export default createStore({
  state: {
    playbackTime: 0,
    isPlaying: false,
  },
  mutations: {
    updatePlaybackTime(state, newTime) {
      state.playbackTime = Number(newTime);
    },
    playAudio(state)  {
      state.isPlaying = true;
    },
    pauseAudio(state) {
      state.isPlaying = false;
    },
    toggleAudio(state) {
      state.isPlaying = !state.isPlaying;
    }
  },
})
