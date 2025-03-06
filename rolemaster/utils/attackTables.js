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

const atkSizeTables = {
  Miniscule: { label: '超微型', multiplier: 0.25 },
  Diminutive: { label: '微型', multiplier: 0.50 },
  Tiny: { label: '超小型', multiplier: 0.67 },
  Small: { label: '小型', multiplier: 0.75 },
  Medium: { label: '中型', multiplier: 1 },
  Big: { label: '大型', multiplier: 1.5 },
  Large: { label: '超大型', multiplier: 2 },
  Huge: { label: '巨型', multiplier: 3 },
  Gigantic: { label: '超巨型', multiplier: 4 },
  Enormous: { label: '泰坦級', multiplier: 5 },
};

export { atkTables, atkSizeTables };