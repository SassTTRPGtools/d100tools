import KrushJson from '@/rolemaster/combatdata/CritTable/Krush.json';
import PunctureJson from '@/rolemaster/combatdata/CritTable/Puncture.json';
import SlashJson from '@/rolemaster/combatdata/CritTable/Slash.json';
import StrikesJson from '@/rolemaster/combatdata/CritTable/Strikes.json';
import SweepsJson from '@/rolemaster/combatdata/CritTable/Sweeps.json';
import UnbalanceJson from '@/rolemaster/combatdata/CritTable/Unbalance.json';
import ImpactJson from '@/rolemaster/combatdata/CritTable/Impact.json';
import GrappleJson from '@/rolemaster/combatdata/CritTable/Grapple.json';
import HeatJson from '@/rolemaster/combatdata/CritTable/Heat.json';
import ColdJson from '@/rolemaster/combatdata/CritTable/Cold.json';
import ElectricityJson from '@/rolemaster/combatdata/CritTable/Electricity.json';
import HolyJson from '@/rolemaster/combatdata/CritTable/Holy.json';
import StreamJson from '@/rolemaster/combatdata/CritTable/Stream.json';
import AcidJson from '@/rolemaster/combatdata/CritTable/Acid.json';
import SubdualJson from '@/rolemaster/combatdata/CritTable/Subdual.json';


const critTables = {
  Krush: KrushJson,
  Puncture: PunctureJson,
  Slash: SlashJson,
  Strikes: StrikesJson,
  Sweeps: SweepsJson,
  Unbalance: UnbalanceJson,
  Impact: ImpactJson,
  Grapple: GrappleJson,
  Heat: HeatJson,
  Cold: ColdJson,
  Electricity: ElectricityJson,
  Holy: HolyJson,
  Stream: StreamJson,
  Acid: AcidJson,
  Subdual: SubdualJson,
};

const critKeyMapping = {
  H: critTables.Heat,
  O: critTables.Cold,
  L: critTables.Electricity,
  I: critTables.Impact,
  K: critTables.Krush,
  P: critTables.Puncture,
  S: critTables.Slash,
  T: critTables.Strikes,
  U: critTables.Unbalance,
  W: critTables.Sweeps,
  G: critTables.Grapple,
};

const critOptions = [
  { value: 'Krush', label: '鈍擊' },
  { value: 'Puncture', label: '穿刺' },
  { value: 'Slash', label: '揮砍' },
  { value: 'Strikes', label: '打擊' },
  { value: 'Sweeps', label: '橫掃&摔投' },
  { value: 'Unbalance', label: '不平衡' },
  { value: 'Impact', label: '衝擊' },
  { value: 'Grapple', label: '擒拿' },
  { value: 'Heat', label: '熱量' },
  { value: 'Cold', label: '寒冷' },
  { value: 'Electricity', label: '閃電' },
  { value: 'Holy', label: '神聖' },
  { value: 'Stream', label: '蒸氣' },
  { value: 'Acid', label: '強酸' },
  { value: 'Subdual', label: '制伏' },
];

const critSeverityOptions = [
  { value: 'Z', label: 'Z' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'E+A' },
  { value: 'G', label: 'E+B' },
  { value: 'H', label: 'E+C' },
  { value: 'I', label: 'E+C+A' },
  { value: 'J', label: 'E+C+B' }
];

const hitLocationMapping = {
  "1-1": '頭部',
  "2-3": '胸部',
  "4-5": '腹部',
  "6-10": '腿部',
  "11-15": '手臂',
  "16-20": '頭部',
  "21-25": '胸部',
  "26-35": '腹部',
  "36-45": '腿部',
  "46-65": '手臂',
  "66-66": '腹部',
  "67-75": '腿部',
  "76-80": '胸部',
  "81-85": '頭部',
  "86-90": '手臂',
  "91-95": '腿部',
  "96-97": '腹部',
  "98-99": '胸部',
  "100-100": '頭部'
};


export { critTables, critKeyMapping , critOptions, critSeverityOptions, hitLocationMapping };