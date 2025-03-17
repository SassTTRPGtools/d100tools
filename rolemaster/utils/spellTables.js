import ClericBaseJson from '@/rolemaster/spelldata/Channeling/ClericBase.json';
import ClosedChannelingJson from '@/rolemaster/spelldata/Channeling/ClosedChanneling.json';
import DruidBaseJson from '@/rolemaster/spelldata/Channeling/DruidBase.json';
import EvilChannelingJson from '@/rolemaster/spelldata/Channeling/EvilChanneling.json';
import OpenChannelingJson from '@/rolemaster/spelldata/Channeling/OpenChanneling.json';
import PaladinBaseJson from '@/rolemaster/spelldata/Channeling/PaladinBase.json';
import RangerBaseJson from '@/rolemaster/spelldata/Channeling/RangerBase.json';
import SanctifierBaseJson from '@/rolemaster/spelldata/Channeling/SanctifierBase.json';

import AdeptBaseJson from '@/rolemaster/spelldata/Essence/AdeptBase.json';
import BardBaseJson from '@/rolemaster/spelldata/Essence/BardBase.json';
import ClosedEssenceJson from '@/rolemaster/spelldata/Essence/ClosedEssence.json';
import DabblerBaseJson from '@/rolemaster/spelldata/Essence/DabblerBase.json';
import EvilEssenceJson from '@/rolemaster/spelldata/Essence/EvilEssence.json';
import IllusionistBaseJson from '@/rolemaster/spelldata/Essence/IllusionistBase.json';
import MagicianBaseJson from '@/rolemaster/spelldata/Essence/MagicianBase.json';
import OpenEssenceJson from '@/rolemaster/spelldata/Essence/OpenEssence.json';

import HealerBaseJson from '@/rolemaster/spelldata/Hybrid/HealerBase.json';
import MysticBaseJson from '@/rolemaster/spelldata/Hybrid/MysticBase.json';
import SorcererBaseJson from '@/rolemaster/spelldata/Hybrid/SorcererBase.json';

import ClosedMentalismJson from '@/rolemaster/spelldata/Mentalism/ClosedMentalism.json';
import EvilMentalismJson from '@/rolemaster/spelldata/Mentalism/EvilMentalism.json';
import LayHealerBaseJson from '@/rolemaster/spelldata/Mentalism/LayHealerBase.json';
import MagentBaseJson from '@/rolemaster/spelldata/Mentalism/MagentBase.json';
import MentalistBaseJson from '@/rolemaster/spelldata/Mentalism/MentalistBase.json';
import MonkBaseJson from '@/rolemaster/spelldata/Mentalism/MonkBase.json';
import OpenMentalismJson from '@/rolemaster/spelldata/Mentalism/OpenMentalism.json';
import PsychographerBaseJson from '@/rolemaster/spelldata/Mentalism/PsychographerBase.json';

// JSON 物件
const spellTables = {
  ClericBase: ClericBaseJson,
  ClosedChanneling: ClosedChannelingJson,
  DruidBase: DruidBaseJson,
  EvilChanneling: EvilChannelingJson,
  OpenChanneling: OpenChannelingJson,
  PaladinBase: PaladinBaseJson,
  RangerBase: RangerBaseJson,
  SanctifierBase: SanctifierBaseJson,
  AdeptBase: AdeptBaseJson,
  BardBase: BardBaseJson,
  ClosedEssence: ClosedEssenceJson,
  DabblerBase: DabblerBaseJson,
  EvilEssence: EvilEssenceJson,
  IllusionistBase: IllusionistBaseJson,
  MagicianBase: MagicianBaseJson,
  OpenEssence: OpenEssenceJson,
  HealerBase: HealerBaseJson,
  MysticBase: MysticBaseJson,
  SorcererBase: SorcererBaseJson,
  ClosedMentalism: ClosedMentalismJson,
  EvilMentalism: EvilMentalismJson,
  LayHealerBase: LayHealerBaseJson,
  MagentBase: MagentBaseJson,
  MentalistBase: MentalistBaseJson,
  MonkBase: MonkBaseJson,
  OpenMentalism: OpenMentalismJson,
  PsychographerBase: PsychographerBaseJson,
};

const spellOptions = [
  {
    category: '引導領域',
    options: [
      { value: 'OpenChanneling', label: '開放引導' },
      { value: 'ClosedChanneling', label: '封閉引導' },
      { value: 'ClericBase', label: '牧師' },      
      { value: 'DruidBase', label: '德魯伊' },
      { value: 'PaladinBase', label: '聖騎士' },
      { value: 'RangerBase', label: '遊俠' },
      { value: 'SanctifierBase', label: '聖化術士' },
      { value: 'EvilChanneling', label: '邪惡引導' },
    ],
  },
  {
    category: '本源領域',
    options: [
      { value: 'OpenEssence', label: '開放本源' },
      { value: 'ClosedEssence', label: '封閉本源' },      
      { value: 'BardBase', label: '吟遊詩人' },      
      { value: 'DabblerBase', label: '雜學家' },      
      { value: 'IllusionistBase', label: '幻術師' },
      { value: 'MagicianBase', label: '魔導師' },
      { value: 'AdeptBase', label: '煉金術士' },
      { value: 'EvilEssence', label: '邪惡本源' },
    ],
  },
  {
    category: '混合領域',
    options: [
      { value: 'HealerBase', label: '治療者' },
      { value: 'MysticBase', label: '秘術師' },
      { value: 'SorcererBase', label: '術士' },
    ],
  },
  {
    category: '心神領域',
    options: [
      { value: 'OpenMentalism', label: '開放心神' },
      { value: 'ClosedMentalism', label: '封閉心神' },      
      { value: 'LayHealerBase', label: '外道醫師' },
      { value: 'MagentBase', label: '魔特務' },
      { value: 'MentalistBase', label: '心靈術師' },
      { value: 'MonkBase', label: '修行者' },      
      { value: 'PsychographerBase', label: '心能術士' },
      { value: 'EvilMentalism', label: '邪惡心神' },
    ],
  },
];

export { spellTables, spellOptions };