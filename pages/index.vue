<script setup>
  import {DiceRollerRenderless} from '@dice-roller/vue';

</script>
<template>
  <div>
    <a-row justify="center" align="middle" style="padding: 24px 0;">
      <a-col :span="24" style="text-align: center;">
        <img src="https://dice-roller.github.io/documentation/hero.svg" style="width: 32px; vertical-align: middle;">
        <a-typography-text style="margin-left: 8px; font-size: 16px; font-weight: bold;">
          更多用法見
          <a-typography-link href="https://dice-roller.github.io/documentation/guide/#features" target="_blank" style="text-decoration: underline; color: #1890ff;">
            RPG Dice Roller
          </a-typography-link>
        </a-typography-text>
      </a-col>
    </a-row>

    <DiceRollerRenderless v-slot="{ error, output, roll, on, bind }">
      <a-row justify="center"  align="middle">
        <a-col style="text-align: center;">
          <a-form :style="{ maxWidth: '400px', display: 'inline-flex', width: '100%' }">
            <a-form-item :style="{ flex: '1', marginBottom: '0' }">
              <a-input v-on="on" v-bind="bind" placeholder="e.g. 1d100" />
            </a-form-item>
            <a-button type="primary" @click="roll" style="margin-left: 8px;">
              確定
            </a-button>
          </a-form>
        </a-col>
      </a-row>
      <a-row justify="center" style="padding: 24px 0;">
        <a-col style="text-align: center; font-weight: bold;">
          <a-typography-text v-if="output">{{ output }}</a-typography-text>
        </a-col>
      </a-row>

      <a-row justify="center">
        <a-col style="text-align: center;">
          <a-typography-text type="danger" v-if="error" style="font-size: 12px; font-style: italic;">{{ error }}</a-typography-text>
        </a-col>
      </a-row>
    </DiceRollerRenderless>
  </div>
</template>