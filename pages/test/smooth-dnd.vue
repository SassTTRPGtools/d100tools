<script setup>
import { Container, Draggable } from "vue3-smooth-dnd";
import { ref } from "vue";

const items = ref([
  { id: 1, data: "Princess Mononoke" },
  { id: 2, data: "Spirited Away" },
  { id: 3, data: "My Neighbor Totoro" },
  { id: 4, data: "Howl's Moving Castle" },
]);

const onDrop = (dropResult) => {
  const updatedItems = applyDrag(items.value, dropResult); // Use items.value for reactivity
  items.value = updatedItems; // Update the reactive state
};

const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;

  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr]; // Copy to avoid mutation
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

</script>
<template>
  <Container @drop="onDrop">
    <Draggable v-for="(item, index) in items" :key="item.id">
      <div>{{index+1}} =>  {{ item.data }} - {{item.id}}</div>
    </Draggable>
  </Container>
</template>