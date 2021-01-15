<template>
	<div id="audio-player-root">
		<!-- Hide the default audio player -->
    <audio style="display: none" ref="player" :id="1">
      <source :src="src" type="audio/mpeg" />
    </audio>

    <div class="player-wrapper">
      <div class="play-pause">
        <i
          v-if="isPlaying"
          class='fas fa-pause'
          @click="pauseAudio"
        />

        <i
          v-else
          class='fas fa-play'
          @click="playAudio"
        />
      </div>

      <div class="progress-bar">
        <input
          v-model="playbackTime"
          type="range"
          min="0"
          :max="audioDuration"
          id="position"
          name="position"
        />

        <!-- Show loading indicator until audio has been loaded -->
        <div
          v-if="!audioLoaded"
          class="loading"
        >
          Loading please wait...
        </div>

        <div
          v-else
          class="time-info"
        >
          <span v-html="elapsedTime()" />
        
          <span v-html="totalTime()" />
        </div>
      </div>  
    </div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			audioDuration: 100,
			audioLoaded: false,
      src: require("../assets/audio.wav")
		};
  },

  computed: {
    playbackTime: {
      get() {
        return this.$store.state.playbackTime;
      },
      set(time) {
        this.$store.commit("updatePlaybackTime", time);
      }
    },

    isPlaying() {
      return this.$store.state.isPlaying;
    },  
  },

	methods: {
    //Updates Vuex Store "playbackTime" with new playback time
    updatePlaybackTime(time) {
      this.$store.commit("updatePlaybackTime", time);
    },

    //Sets Vuex Store "isPlaying" to true
    //Plays audio player
    playAudio() {
      this.$refs.player.play()
      this.$store.commit("playAudio")
    },

    //Sets Vuex Store "isPlaying" to false
    //Pauses audio player
    pauseAudio() {
      this.$refs.player.pause()
      this.$store.commit("pauseAudio")
    },

		//Set the range slider max value equal to audio duration
		initSlider() {
			const audio = this.$refs.player;
			if (audio) {
				this.audioDuration = Math.round(audio.duration);
			}
    },
    
		//Convert audio current time from seconds to min:sec display
		convertTime(seconds) {
			const format = (val) => `0${Math.floor(val)}`.slice(-2);
			const minutes = (seconds % 3600) / 60;
			return [minutes, seconds % 60].map(format).join(":");
    },
    
		//Show the total duration of audio file
		totalTime() {
			const audio = this.$refs.player;
			if (audio) {
				const seconds = audio.duration;
				return this.convertTime(seconds);
			} else {
				return "00:00";
			}
    },
    
		//Display the audio time elapsed so far
		elapsedTime() {
			const audio = this.$refs.player;
			if (audio) {
				const seconds = audio.currentTime;
				return this.convertTime(seconds);
			} else {
				return "00:00";
			}
    },
    
		// //Playback listener function runs every 100ms while audio is playing
		playbackListener() {
			const audio = this.$refs.player;
      //Sync local 'playbackTime' const to audio.currentTime and update global state
      this.updatePlaybackTime(audio.currentTime);

			//Add listeners for audio pause and audio end events
			audio.addEventListener("ended", this.endListener);
			audio.addEventListener("pause", this.pauseListener);
    },
    
		//Function to run when audio is paused by user
		pauseListener() {
			this.pauseAudio();
			this.listenerActive = false;
			this.cleanupListeners();
    },
    
		//Function to run when audio play reaches the end of file
		endListener() {
			this.pauseAudio();
			this.listenerActive = false;
			this.cleanupListeners();
    },
    
		//Remove listeners after audio play stops
		cleanupListeners() {
			const audio = this.$refs.player;
			audio.removeEventListener("timeupdate", this.playbackListener);
			audio.removeEventListener("ended", this.endListener);
			audio.removeEventListener("pause", this.pauseListener);
    },
  },
  
	mounted: function () {
		// nextTick code will run only after the entire view has been rendered
		this.$nextTick(function () {
      const audio = this.$refs.player;
      
			// Wait for audio to load, then run initSlider() to get audio duration and set the max value of our slider
			// "loademetadata" Event https://www.w3schools.com/tags/av_event_loadedmetadata.asp
			audio.addEventListener(
				"loadedmetadata",
				function () {
					this.initSlider();
				}.bind(this)
      );
      
			// "canplay" HTML Event lets us know audio is ready for play https://www.w3schools.com/tags/av_event_canplay.asp
			audio.addEventListener(
				"canplay",
				function () {
					this.audioLoaded = true;
				}.bind(this)
      );
      
			//Wait for audio to begin play, then start playback listener function
			this.$watch("isPlaying", function () {
        const audio = this.$refs.player;
				if (this.isPlaying) {
          audio.play();
					this.initSlider();
					//prevent starting multiple listeners at the same time
					if (!this.listenerActive) {
						this.listenerActive = true;
						audio.addEventListener("timeupdate", this.playbackListener);
					}
				} else {
          audio.pause();
        }
      });
      
			//Update current audio position when user drags progress slider
			this.$watch("playbackTime", function () {
				const diff = Math.abs(this.playbackTime - this.$refs.player.currentTime);

				//Throttle synchronization to prevent infinite loop between playback listener and this watcher
				if (diff > 0.01) {
					this.$refs.player.currentTime = this.playbackTime;
				}
      });
		});
	},
};
</script>

<style>
#audio-player-root {
  width: 100%;
  padding: 1.5rem;
  margin-bottom: -4px;
}

.player-wrapper {
  display: flex;
  justify-content: space-between;
}

/* Play/Pause Button */
.play-pause > i {
  font-size: 2rem;
  color: #ff6d6d;
  margin-right: 1.25rem;
  cursor: pointer;
}

.progress-bar {
  flex: 1;
}

.time-info {
  display: flex;
  justify-content: space-between;
}

input[type="range"] {
	margin: auto;
	-webkit-appearance: none;
	position: relative;
	overflow: hidden;
	width: 100%;
	cursor: pointer;
	outline: none;
	border-radius: 0;
	background: transparent;
}

input[type="range"]:focus {
	outline: none;
}

::-webkit-slider-runnable-track {
	background: #ff6d6d46;
}

::-webkit-slider-thumb {
	-webkit-appearance: none;
	width: 8px;
	height: 8px;
	background: #fff;
  box-shadow: -100vw 0 0 100vw #ff6d6d;
	border: 2px solid rgb(0, 0, 0);
}

::-moz-range-track {
	height: 4px;
	background: #ddd;
}

::-moz-range-thumb {
	background: #fff;
	height: 8px;
	width: 8px;
	border: 3px solid #999;
	border-radius: 100% !important;
	box-sizing: border-box;
}

::-ms-fill-lower {
	background: #ff6d6d;
}

::-ms-thumb {
	background: #fff;
	border: 2px solid #999;
	height: 8px;
	width: 20px;
	box-sizing: border-box;
}

::-ms-ticks-after {
	display: none;
}

::-ms-ticks-before {
	display: none;
}

::-ms-track {
	background: #ddd;
	color: transparent;
	height: 4px;
	border: none;
}

::-ms-tooltip {
	display: none;
}
</style>
