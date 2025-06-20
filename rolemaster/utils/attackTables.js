import ArmingSwordJson from '@/rolemaster/combatdata/ATKTable/ArmingSword.json';
import BallFireJson from '@/rolemaster/combatdata/ATKTable/BallFire.json';
import BallColdJson from '@/rolemaster/combatdata/ATKTable/BallCold.json';
import BallLightningJson from '@/rolemaster/combatdata/ATKTable/BallLightning.json';
import BattleAxeJson from '@/rolemaster/combatdata/ATKTable/BattleAxe.json';
import BeakJson from '@/rolemaster/combatdata/ATKTable/Beak.json';
import BiteJson from '@/rolemaster/combatdata/ATKTable/Bite.json';
import BolaJson from '@/rolemaster/combatdata/ATKTable/Bola.json';
import BoltFireJson from '@/rolemaster/combatdata/ATKTable/BoltFire.json';
import BoltIceJson from '@/rolemaster/combatdata/ATKTable/BoltIce.json';
import BoltLightningJson from '@/rolemaster/combatdata/ATKTable/BoltLightning.json';
import BoltWaterJson from '@/rolemaster/combatdata/ATKTable/BoltWater.json';
import BowLongJson from '@/rolemaster/combatdata/ATKTable/BowLong.json';
import BowShortJson from '@/rolemaster/combatdata/ATKTable/BowShort.json';
import BroadswordJson from '@/rolemaster/combatdata/ATKTable/Broadsword.json';
import ClawJson from '@/rolemaster/combatdata/ATKTable/Claw.json';
import ClubJson from '@/rolemaster/combatdata/ATKTable/Club.json';
import CrossbowJson from '@/rolemaster/combatdata/ATKTable/Crossbow.json';
import CrushJson from '@/rolemaster/combatdata/ATKTable/Crush.json';
import DaggerJson from '@/rolemaster/combatdata/ATKTable/Dagger.json';
import FalchionJson from '@/rolemaster/combatdata/ATKTable/Falchion.json';
import FightingStickJson from '@/rolemaster/combatdata/ATKTable/FightingStick.json';
import FlailJson from '@/rolemaster/combatdata/ATKTable/Flail.json';
import GrappleJson from '@/rolemaster/combatdata/ATKTable/Grapple.json';
import HornJson from '@/rolemaster/combatdata/ATKTable/Horn.json';
import MaceJson from '@/rolemaster/combatdata/ATKTable/Mace.json';
import RamJson from '@/rolemaster/combatdata/ATKTable/Ram.json';
import RapierJson from '@/rolemaster/combatdata/ATKTable/Rapier.json';
import RockJson from '@/rolemaster/combatdata/ATKTable/Rock.json';
import ScimitarJson from '@/rolemaster/combatdata/ATKTable/Scimitar.json';
import ShieldJson from '@/rolemaster/combatdata/ATKTable/Shield.json';
import SlingJson from '@/rolemaster/combatdata/ATKTable/Sling.json';
import SpearJson from '@/rolemaster/combatdata/ATKTable/Spear.json';
import StingerJson from '@/rolemaster/combatdata/ATKTable/Stinger.json';
import TrampleJson from '@/rolemaster/combatdata/ATKTable/Trample.json';
import UnarmedStrikesJson from '@/rolemaster/combatdata/ATKTable/UnarmedStrikes.json';
import UnarmedSweepsJson from '@/rolemaster/combatdata/ATKTable/UnarmedSweeps.json';
import WarHammerJson from '@/rolemaster/combatdata/ATKTable/WarHammer.json';
import WhipJson from '@/rolemaster/combatdata/ATKTable/Whip.json';

const atkTables = {
  ArmingSword: ArmingSwordJson,
  BallFire: BallFireJson,
  BallCold: BallColdJson,
  BallLightning: BallLightningJson,
  BattleAxe: BattleAxeJson,
  Beak: BeakJson,
  Bite: BiteJson,
  Bola: BolaJson,
  BoltFire: BoltFireJson,
  BoltIce: BoltIceJson,
  BoltLightning: BoltLightningJson,
  BoltWater: BoltWaterJson,
  BowLong: BowLongJson,
  BowShort: BowShortJson,
  Broadsword: BroadswordJson,
  Claw: ClawJson,
  Club: ClubJson,
  Crossbow: CrossbowJson,
  Crush: CrushJson,
  Dagger: DaggerJson,
  Falchion: FalchionJson,
  FightingStick: FightingStickJson,
  Flail: FlailJson,
  Grapple: GrappleJson,
  Horn: HornJson,
  Mace: MaceJson,
  Ram: RamJson,
  Rapier: RapierJson,
  Rock: RockJson,
  Scimitar: ScimitarJson,
  Shield: ShieldJson,
  Sling: SlingJson,
  Spear: SpearJson,
  Stinger: StingerJson,
  Trample: TrampleJson,
  UnarmedStrikes: UnarmedStrikesJson,
  UnarmedSweeps: UnarmedSweepsJson,
  WarHammer: WarHammerJson,
  Whip: WhipJson,
};

const atkOptions = [
  {
    category: '元素法術類',
    options: [
      { value: 'BoltFire', label: '火焰箭' },
      { value: 'BoltIce', label: '冰箭術' },
      { value: 'BoltLightning', label: '閃電箭/電擊箭' },
      { value: 'BoltWater', label: '水箭術' },
      { value: 'BallFire', label: '火球' },
      { value: 'BallCold', label: '冰凍球' },
      { value: 'BallLightning', label: '閃電球/電擊球' }
    ]
  },
  {
    category: '天生武器&石頭',
    options: [
      { value: 'Beak', label: '喙擊' },
      { value: 'Bite', label: '啃咬' },
      { value: 'Claw', label: '爪抓' },
      { value: 'Horn', label: '角擊' },
      { value: 'Stinger', label: '刺擊/飛鏢(-1)/吹箭(-1)' },
      { value: 'UnarmedStrikes', label: '無武裝打擊' },
      { value: 'UnarmedSweeps', label: '無武裝橫掃' },
      { value: 'Grapple', label: '擒拿/摔跤/小型網(-1)/網子/大型網(+1)' },
      { value: 'Ram', label: '撞擊' },
      { value: 'Trample', label: '踐踏' },
      { value: 'Crush', label: '粉碎' },
      { value: 'Rock', label: '石頭/小石頭(-1)/大石頭(+1)' }
    ]
  },
  {
    category: '遠程武器類',
    options: [
      { value: 'BowLong', label: '長弓' },
      { value: 'BowShort', label: '短弓/複合弓' },
      { value: 'Sling', label: '投石索/投石仗(+1)/彈弓(-1)' },
      { value: 'Crossbow', label: '輕弩/手弩(-1)/重弩(+1)' },
      { value: 'Bola', label: '繩球' }
    ]
  },
  {
    category: '近戰武器類',
    options: [
      { value: 'Dagger', label: '匕首' },
      { value: 'Rapier', label: '刺劍/銳劍(-1)' },
      { value: 'ArmingSword', label: '直劍/短劍(-1)/長劍(+1)' },
      { value: 'Broadsword', label: '闊劍/大劍(+1)/長柄刀(+1)' },
      { value: 'Falchion', label: '直刀/大直刀(+1)/砍刀(-1)' },
      { value: 'Scimitar', label: '彎刀/長彎刀(+1)' },
      { value: 'FightingStick', label: '單手棍/輕棍(-1)/長棍(+1)' },
      { value: 'Club', label: '棍棒/短棒(-1)/投擲棍(-1)/巨棍(+1)' },
      { value: 'Mace', label: '錘子/輕錘(-1)/巨錘(+1)' },
      { value: 'WarHammer', label: '戰鎚/軍用鶴嘴錘(+1)/長柄斧(+1)' },
      { value: 'BattleAxe', label: '戰斧/手斧(-1)/巨斧(+1)/斧槍(+1)' },
      { value: 'Flail', label: '連枷/輕型連枷(-1)/重型連枷(+1)' },
      { value: 'Spear', label: '矛/標槍(-1)/2H-矛(+1)/長矛(+1)/斧槍(+1)/長柄斧(+1)' },
      { value: 'Whip', label: '鞭子' },
      { value: 'Shield', label: '標準盾/小盾(-1)/大盾/牆盾' }
    ]
  }
];

const atkSizeTables = {
  Miniscule: { label: '超微型 (Mi / 1 / I)', multiplier: 0.25,sizeAdjustment:-4 },
  Diminutive: { label: '微型 (D / 2 / II)', multiplier: 0.50,sizeAdjustment:-3 },
  Tiny: { label: '超小型 (T / 3 / III)', multiplier: 0.67,sizeAdjustment:-2 },
  Small: { label: '小型 (S / 4 / IV)', multiplier: 0.75,sizeAdjustment:-1 },
  Medium: { label: '中型 (M / 5 / V)', multiplier: 1,sizeAdjustment:0 },
  Big: { label: '大型 (B / 6 / VI)', multiplier: 1.5,sizeAdjustment:1 },
  Large: { label: '超大型 (L / 7 / VII)', multiplier: 2,sizeAdjustment:2 },
  Huge: { label: '巨型 (H / 8 / VIII)', multiplier: 3 ,sizeAdjustment:3},
  Gigantic: { label: '超巨型 (G / 9 / IX)', multiplier: 4 ,sizeAdjustment:4},
  Enormous: { label: '泰坦級 (E / 10 / X)', multiplier: 5 ,sizeAdjustment:5},
  Immense: { label: '巨無霸級 (I / 11 / XI)', multiplier: 6 ,sizeAdjustment:6},
  Behemoth: { label: '巨獸級 (O / 12 / XII)', multiplier: 7 ,sizeAdjustment:7},
  Leviathan: { label: '深淵級 (V / 13 / XIII)', multiplier: 8 ,sizeAdjustment:8},
};

export { atkTables, atkOptions , atkSizeTables };