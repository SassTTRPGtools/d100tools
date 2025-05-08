import fumbleJson from '@/rolemaster/combatdata/fumble.json';

import ChannelingJson from '@/rolemaster/combatdata/SpellFumble/Channeling.json';
import EssenceJson from '@/rolemaster/combatdata/SpellFumble/Essence.json';
import MentalismJson from '@/rolemaster/combatdata/SpellFumble/Mentalism.json';


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


export { fumbleJson, fumbleOptions,spellfumbleJson,spellfumbleOptions };