import fumbleJson from '@/rolemaster/combatdata/fumble.json';

import ChannelingJson from '@/rolemaster/combatdata/SpellFumble/Channeling.json';
import EssenceJson from '@/rolemaster/combatdata/SpellFumble/Essence.json';
import MentalismJson from '@/rolemaster/combatdata/SpellFumble/Mentalism.json';

import AlchemicalJson from '@/rolemaster/combatdata/SpellFumble/Alchemical.json';




const fumbleOptions = [
  { value: 'OneHandedWeapons', label: '單手武器' },
  { value: 'TwoHandedWeapons', label: '雙手武器' },
  { value: 'Animal', label: '動物' },
  { value: 'MountedCombat', label: '騎乘戰鬥' },
  { value: 'Unarmed', label: '無武裝' },
  { value: 'BowsAndCrossbows', label: '弓弩類' },
  { value: 'Sling', label: '投石索' },
  { value: 'Throwing', label: '投擲' },
  { value: 'ElementalBolt', label: '元素箭' },
  { value: 'ElementalSphereCone', label: '元素球／錐形' },
];

const spellfumbleJson = {
  Channeling: ChannelingJson,
  Essence: EssenceJson,
  Mentalism: MentalismJson,
};

const spellfumbleOptions = [
  { value: 'Channeling', label: '引導法術失敗' },
  { value: 'Essence', label: '本源法術失敗' },
  { value: 'Mentalism', label: '心神法術失敗' },
];

const AlchemicalFumbleOptions = [
  { value: 'Bonus', label: '加值' },
  { value: 'EmbeddedEntity', label: '嵌入實體' },
  { value: 'General', label: '一般' },
  { value: 'IndependentEntity', label: '獨立實體' },
  { value: 'Intelligence', label: '智能' },
  { value: 'Location', label: '地點' },
  { value: 'Organism', label: '有機體' },
  { value: 'Potion', label: '藥水' },
  { value: 'PowerEnhancer', label: '異能增強' },
  { value: 'SpellPower', label: '法術能量' },
];

export { fumbleJson, fumbleOptions,spellfumbleJson,spellfumbleOptions,AlchemicalJson,AlchemicalFumbleOptions };