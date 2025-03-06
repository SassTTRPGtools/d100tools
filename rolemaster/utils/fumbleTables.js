import fumbleJson from '@/rolemaster/combatdata/fumble.json';


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


export { fumbleJson, fumbleOptions };