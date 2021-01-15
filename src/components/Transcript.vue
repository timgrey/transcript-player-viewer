<template>
  <div class="transcript-wrapper">
    <div class="nav">
      <i class="fas fa-times" />
      <span>{{ date }}</span>
      <i class="fas fa-ellipsis-v" />
    </div>

    <div class="phrases">
      <phrase
        v-for="(phrase, i) in formattedPhrases"
        :key="`phrase-${i}`"
        class="phrase"
        :phrase="phrase"
        @click="selectPhrase(phrase.start)"
      />
    </div>

    <audio-player class="audio-player" />
  </div>
</template>

<script>
import AudioPlayer from './AudioPlayer.vue'
import Phrase from './Phrase.vue'

export default {
	components: { AudioPlayer, Phrase },
  name: 'Transcript',
  data() {
    return {
      //Transcript Date
      date: 'Jan. 14, 2021',
      //Transcript
      transcript: {
        "phrases": [
          {
            "len": 13.3, 
            "text": "Albert thanks for being with us this morning, you know talking about this idea that more people could become eligible to get a vaccine that just puts more pressure on you and moderna to manufacture these", 
            "start": 1.5
          }, 
          {
            "len": 15.899999999999999, 
            "text": "doses tells about how the manufacturing is going in your confidence in being able to keep up a steady Pace. I think that's exactly what needs to be done. And I think so far. I don't", 
            "start": 14.8
          },
          {
            "len": 19.3, 
            "text": "think about offering girl in the country. We have much more than they can use right now. So I think the main booking like right now it just to make sure it was manufactured.", 
            "start": 30.7
          },
          {
            "len": 19.3, 
            "text": "just puts more pressure on you and moderna to manufacture these doses tells about how the manufacturing is going in your confidence in being able to keep up a steady Pace. I think that's exactly what needs to be done. And", 
            "start": 9.5
          }, 
          {
            "len": 21.2, 
            "text": "I think so far. I don't think about offering girl in the country. We have much more than they can use right now. So I think the main booking like right now it just to make sure it was manufactured.", 
            "start": 28.8
          }, 
          {
            "len": 13.700000000000003, 
            "text": "Production for this year. This is where we are right now so I can", 
            "start": 61.5
          }, 
          {
            "len": 3.5999999999999943, 
            "text": "I'm going to be thought is going to be the opposite problem that everyone can eat.", 
            "start": 88.9
          }
        ]
      },
    }
  },

  computed: {
    //Returns Vuex State "playbackTime"
    playbackTime() {
      return this.$store.state.playbackTime;
    },

    //Returns Vuex State "isPlaying"
    isPlaying() {
      return this.$store.state.isPlaying;
    },

    // Sorts phrases by start time.
    // Checks for overlapping phrases.
    // Removes overlapping sub string from one of the phrases being compared.
    // Updates phrase 'len' property to reflect the new length based on the start time of the subsquent phrase
    formattedPhrases() {
      const phrases = this.sortPhrases(this.transcript.phrases);
      for (let i = 0; i < phrases.length - 1; i++) {
        //Compares Phrase and the current index and the subsequent phrase
        if (this.isOverlappingPhrasePair(phrases[i], phrases[i + 1])) {
          const phraseA = phrases[i]
          const phraseB = phrases[i + 1]
          const overlapLength = (phraseA.len + phraseA.start) - phraseB.start

          //Trimms off overlapping time segments off of phraseA's len property 
          phrases[i].len -= overlapLength

          //Finds the longest common prefix that could be overlapping 
          //and removes it from the first compared phrase
          phrases[i].text = this.removeOverlappingSubstring(phraseA.text, phraseB.text)
        }
      }
      return phrases
    },
  },

  methods: {
    //Sets Vuex Store "isPlaying" to true.
    playAudio() {
      this.$store.commit("playAudio");
    },

    //When a phrase is clicked, the player will start playing from that phrases start time.
    selectPhrase(time) {
      this.playAudio();
      this.updatePlaybackTime(time);
    },

    //Sets Vuex Store "playbackTime" to an updated time
    updatePlaybackTime(time) {
      this.$store.commit("updatePlaybackTime", time);
    },

    //sorts phrases based on start time
    sortPhrases(phrases) {
      return phrases.sort((a, b) => a.start - b.start)
    },

    //checks if two compared phrases overlap based on start times and duration of segments
    isOverlappingPhrasePair(phraseA, phraseB) {
      return (
        phraseA.start < phraseB.start && 
        (phraseA.start + phraseA.len) > phraseB.start
      );
    },

    //finds the longest overlapping substring and returns the first string with overlapping substring removed
    removeOverlappingSubstring(str1, str2) {
      for (let i = 1; i < str1.length; i++) {
        const subString = str1.slice(i);
        if (str2.includes(subString)) {
          return str1.slice(0, i)
        }
      }
    }
  }
}
</script>

<style scoped>
  .transcript-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    background: whitesmoke;
  }

  .nav {
    background: rgb(224, 224, 224);
    height: 6rem;
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    color: rgb(53, 53, 53);
    font-size: 1rem;
    font-weight: bolder;
    position: relative;
  }

  .nav > i {
    font-size: 1.25rem;
    cursor: pointer;
  }

  .nav > .fa-times {
    margin-right: 1.25rem;
  }

  .nav > .fa-ellipsis-v {
    position: absolute;
    right: 1.5rem;
  }

  .phrases {
    flex: 1 1 auto;
    padding: 1rem;
    overflow-y: scroll;
  }

  .phrase {
    margin-bottom: 1rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
  }

  .phrase:hover {
    background: #e6e6e6 !important;
  }

  .audio-player {
    border-top: 1px solid lightgrey;
  }
</style>
