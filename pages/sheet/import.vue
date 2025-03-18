<template>
  <div>
    <input type="text" v-model="sheetLink" placeholder="貼上 Google Sheets 連結" />
    <button @click="loadSheetData">讀取資料</button>
    <table>
      <tr v-for="(row, rowIndex) in sheetData" :key="rowIndex">
        <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Papa from 'papaparse';
import axios from 'axios';

const sheetLink = ref('');
const sheetData = ref([]);

const loadSheetData = () => {
  if (!sheetLink.value) return;

  const sheetInfo = extractSheetInfo(sheetLink.value);
  if (!sheetInfo) return;

  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetInfo.sheetId}/gviz/tq?tqx=out:csv&gid=${sheetInfo.gid}`;

  axios.get(csvUrl)
    .then(response => {
      Papa.parse(response.data, {
        complete: (results) => {
          sheetData.value = results.data;
        }
      });
    })
    .catch(error => {
      console.error('讀取資料失敗：', error);
    });
};

const extractSheetInfo = (link) => {
  const regex = /spreadsheets\/d\/([a-zA-Z0-9-_]+)\/.*gid=([0-9]+)/;
  const match = link.match(regex);
  if (match) {
    return {
      sheetId: match[1],
      gid: match[2]
    };
  }
  return null;
};
</script>