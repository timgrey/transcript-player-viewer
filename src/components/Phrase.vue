<template>
  <div
    class="phrase"
    :style="`background: rgba(238, 236, 214, ${isActivePhrase ? '0.726' : '0'});`"
  >
    <div class="time-start">
      <div
        class="active-indicator"
        :style="`opacity: ${isActivePhrase ? '1' : '0.4'};`"
      />
      <span>{{ phraseStartTime }}</span>
    </div>

    <div class="phrase-text">
      <span>...</span>
      <div
        v-for="(word, i) in formattedTextArray"
        :key="`${word.start}${i}`"
        class="word"
        :style="`background: rgba(236, 185, 56, ${isActiveWord(word) ? '.5' : '0'});`"
      >
        {{ word.text }}
      </div>
      <span>...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Phrase',

  props: {
    phrase: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      //total character count of phrase
      charCount: null,
      formattedTextArray: [],
    }
  },

  computed: {
    //Returns Vuex State "playbackTime"
    playbackTime() {
      return this.$store.state.playbackTime;
    },

    // Returns the start time formatted to a MM:SS format
    phraseStartTime() {
      let seconds = Math.round(this.phrase.start);
      const minutes = Math.floor(this.phrase.start / 60);
      seconds = seconds - (minutes * 60);
      return `${this.padNum(minutes)}:${this.padNum(seconds)}`;
    },

    // Checks if the the audio player is currently playing this phrase
    isActivePhrase() {
      return this.playbackTime > this.phrase.start && (this.phrase.start + this.phrase.len) > this.playbackTime;
    },
  },

  mounted() {
    //Parses phrase into an array of words
    const textArray = this.phrase.text.split(" ");

    //Finds character count off all the characters with spaces
    const charCount = textArray.join('').length;

    //Finds how much time to give each character based on the length of the phrase
    const secondsPerLetter = this.phrase.len / charCount;

    //Accumulator to be used to find start times for all words.
    let playbackaccumulator = this.phrase.start

    // Maps the words of the phrase into an array of objects that contains the time length, 
    // start time, and text of that word in the phrase.
    textArray.map(text => {
      const wordPlaybackDuration = text.length * secondsPerLetter
      this.formattedTextArray.push(
        {
          len: wordPlaybackDuration,
          text,
          start: playbackaccumulator,
        }
      )
      playbackaccumulator += wordPlaybackDuration;
    })
    
    //capatilizes the first letter of the phrase
    const firstword = this.formattedTextArray[0].text
    this.formattedTextArray[0].text = `${firstword[0].toUpperCase()}${firstword.slice(1)}`
  },

  methods: {
    //pads the number so it has 2 digits for the MM:SS format
    padNum(num) {
      return ("0"+num).slice(-2);
    },

    //checks if the word is active based on playback time and if this phrase is currently active
    isActiveWord(word) {
      return (
        this.isActivePhrase &&
        this.playbackTime > word.start && 
        (word.start + word.len) > this.playbackTime
      );
    },
  }
}
</script>

<style scoped>
  .time-start {
    display: flex;
    align-items: center;
  }

  .active-indicator {
    background: #ff6d6d;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 100%;
    margin-right: 0.5rem;
  }

  .phrase-text {
    flex-wrap: wrap;
    display: flex;
  }

  .word {
    margin-right: 3px;
    background: rgb(236, 185, 56);
  }
</style>