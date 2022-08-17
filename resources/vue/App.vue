<script setup>
import { ref } from "vue";
// array of 100 numbers
let numbers = ref(Array.from({ length: 100 }, (v, k) => k));
const getRandomNumber = () => {
  const randomIndex = Math.floor(Math.random() * numbers.value.length);
  const randomNumber = numbers.value[randomIndex];
  numbers.value.splice(randomIndex, 1);
  return randomNumber;
};
const player_number = ref(Array.from({ length: 100 }, (v, k) => k));
const getRandomPlayerNumber = () => {
  const randomIndex = Math.floor(Math.random() * player_number.value.length);
  const randomNumber = player_number.value[randomIndex];
  player_number.value.splice(randomIndex, 1);
  return randomNumber;
};

const players = ref(
  Array.from({ length: 100 }, (v, k) => ({
    id: k,
    name: `Player ${k}`,
    number: getRandomPlayerNumber(),
  }))
);
const current_player = ref(0);
let current_player_number = ref(players.value[current_player.value].number);

let last_opened = ref("");
let started = ref(false);

const player_scores = ref([]);
let over = false;
let attempts = ref(50);
let box = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i,
    number: getRandomNumber(),
    //random boolean
    opened: false,
  }))
);

const openBox = async (id, number) => {
  console.log(id, number);
  if (attempts.value === 0) {
    over = true;
    alert("Game Over");
    window.location.reload();
    return;
  }
  last_opened.value = number;
  if (box.value[id].opened === false) {
    box.value[id].opened = true;
    attempts.value--;
  }
  if (number === current_player_number.value) {
    player_scores.value.push({
      player: players.value[current_player.value].name,
      found_in_attempt: attempts.value,
    });

    if (current_player.value === players.value.length) {
      over = true;
      alert("Game Over - You Win");
      return;
    }
    last_opened.value = "";
    current_player.value++;
    current_player_number.value = players.value[current_player.value].number;
    attempts.value = 50;
    console.log(attempts.value);
    box.value.forEach((item) => {
      item.opened = false;
    });
    alert("You found the number");
  }
};

const getClass = () => {
  switch (true) {
    case attempts.value >= 30:
      return "text-green-500";
    case attempts.value >= 20:
      return "text-yellow-500";
    case attempts.value >= 10:
      return "text-orange-500";
    case attempts.value >= 0:
      return "text-red-500";
    case attempts.value <= 0:
      return "text-red-500";
    default:
      return "text-green-500";
  }
};
function paddingZeros(text, limit) {
  const num = text.toString();
  return num.padStart(limit, "0");
}
let counter = 0;
async function start() {
  if (counter === 0) {
    openBox(
      current_player_number.value,
      box.value[current_player_number.value].number
    );
    counter++;
  } else {
    openBox(last_opened.value, box.value[current_player_number.value].number);
    // console.log(
    //   last_opened.value,
    //   box.value[current_player_number.value].number
    // );
  }
}
</script>

<template>
  <div class="min-h-screen bg-green-400">
    <div class="flex justify-between items-center px-4 pt-2">
      <div
        :class="getClass()"
        class="text-2xl bg-white font-bold text-center color p-3 rounded-lg shadow-sm"
      >
        Attempt left:
        {{ attempts }}
      </div>
      <div
        class="text-2xl bg-white font-bold text-center color p-3 rounded-lg shadow-sm text-green-500"
      >
        Number to find: {{ current_player_number }}
      </div>
      <div
        class="text-2xl bg-white font-bold text-center color p-3 rounded-lg shadow-sm text-green-500"
      >
        Player: {{ paddingZeros(current_player, 2) }} / 99
      </div>
    </div>

    <div class="flex items-center justify-around mt-10 h-[80vh]">
      <div class="grid grid-cols-10 md:grid-cols-10 lg:grid-cols-10 gap-2 p-3">
        <div
          v-for="(b, i) in box"
          class="bg-green-100 text-lg font-bold text-center p-3 rounded-lg cursor-pointer hover:ring-2 hover:ring-orange-500"
          :class="[
            `${b.opened ? 'text-red-500' : 'text-green-500'}`,
            { 'bg-yellow-300 text-red-500': b.number === last_opened },
          ]"
          @click="openBox(i, b.number)"
        >
          <span v-if="!b.opened">
            {{ b.id }}
          </span>
          <span v-else>
            {{ b.number }}
          </span>
          <!-- <span class=""> ,{{ b.number }} </span> -->
        </div>
      </div>
      <div class="overflow-y-auto max-h-[80vh] score">
        <ul class="d-flex justify-center" v-for="(score, i) in player_scores">
          <li
            class="text-xl bg-white font-bold color p-3 rounded-lg shadow-sm w-fit mb-1"
          >
            Player : {{ score.player }}
            <br />
            Attempt : {{ 50 - score.found_in_attempt }}
          </li>
        </ul>
      </div>
    </div>
    <div class="d-flex justify-center w-100 text-center">
      <button
        class="bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow-sm"
        @click="start()"
        :disabled="started"
        :class="{ 'bg-red-500': started }"
      >
        {{ started ? "Started" : "Start" }}
      </button>
    </div>
  </div>
</template>

<style>
.score::-webkit-scrollbar-track {
  background-color: #ffffff00;
}

.score::-webkit-scrollbar {
  width: 5px;

  background-color: #4ade80;
}

.score::-webkit-scrollbar-thumb {
  background-color: #ffffff;
  border-radius: 10px;
}
</style>
