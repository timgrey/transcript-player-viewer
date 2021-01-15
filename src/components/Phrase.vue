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
      <div
        v-for="(word, i) in formattedTextArray"
        :key="`${word.start}${i}`"
        class="word"
        :style="`background: rgba(236, 185, 56, ${isActiveWord(word) ? '.5' : '0'});`"
      >
        {{ word.text }}
      </div>
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
      charCount: null,
      formattedTextArray: [],
    }
  },

  computed: {
    playbackTime() {
      return this.$store.state.playbackTime;
    },

    phraseStartTime() {
      let seconds = Math.round(this.phrase.start);
      const minutes = Math.floor(this.phrase.start / 60);
      seconds = seconds - (minutes * 60);
      return `${this.padNum(minutes)}:${this.padNum(seconds)}`;
    },

    phraseText() {
      let sentenceCasedText = this.phrase.text.charAt(0).toUpperCase() + this.phrase.text.slice(1);
      return `... ${sentenceCasedText}...`;
    },

    isActivePhrase() {
      return this.playbackTime > this.phrase.start && (this.phrase.start + this.phrase.len) > this.playbackTime;
    },
  },

  mounted() {
    const textArray = this.phrase.text.split(" ");
    const charCount = textArray.join('').length;
    const secondsPerLetter = this.phrase.len / charCount;
    let playbackaccumulator = this.phrase.start

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
  },

  methods: {
    padNum(num) {
      return ("0"+num).slice(-2);
    },
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