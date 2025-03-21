export const ritualParameters = [
  {
    mainKey: "weightAdjustment", // 主參數名稱
    label: "重量調整",
    options: [
      { value: -10, label: "重量限制每次加倍" }
    ]
  },
  {
    mainKey: "severityAdjustment", // 主參數名稱
    label: "嚴重度調整",
    options: [ // 每次改變重擊嚴重度（例如A到B）
      { value: -30, label: "A" },
      { value: -60, label: "B" },
      { value: -90, label: "C" },
      { value: -120, label: "D" },
      { value: -150, label: "E" },
      { value: -180, label: "F = E+A" },
      { value: -210, label: "G = E+B" },
      { value: -240, label: "H = E+C" },
      { value: -270, label: "I = E+C+A" },
      { value: -300, label: "J = E+C+B" },
    ]
  },
  {
    mainKey: "damageHealing", // 主參數名稱
    label: "傷害/治療",
    options: [
      { value: -10, label: "x2 傷害/治療" },
      { value: -20, label: "x3 傷害/治療" },
      { value: -30, label: "x4 傷害/治療" },
      { value: -40, label: "x5 傷害/治療" }
    ]
  },
  {
    mainKey: "effectRangeAdjustment", // 主參數名稱
    label: "效果範圍調整",
    options: [
      { value: -10, label: "減少效果範圍（無論多小）" },
      { value: -20, label: "每次加倍範圍" },
      { value: -40, label: "每次加倍半徑範圍" }
    ]
  },
  {
    mainKey: "spellRangeAdjustment", // 主參數名稱
    label: "射程調整",
    options: [
      { value: -15, label: "每次加倍法術射程" }
    ]
  },
  {
    mainKey: "spellDurationAdjustment", // 主參數名稱
    label: "法術持續時間調整",
    options: [
      { value: -50, label: "從無持續時間到1輪" },
      { value: -20, label: "從“專注”到“1輪/每級(C)”" },
      { value: -25, label: "移除“(C)”限制" }
    ]
  },
  {
    mainKey: "changeDurationPerLevel", // 主參數名稱
    label: "改變持續時間",
    options: [
      { value: -20, label: "1輪" },
      { value: -40, label: "1分鐘" },
      { value: -60, label: "10分鐘" },
      { value: -80, label: "30分鐘" },
      { value: -100, label: "1小時" },
      { value: -120, label: "1天" },
      { value: -140, label: "1週" },
      { value: -160, label: "1月" },
      { value: -180, label: "1年" },
      { value: -200, label: "10年" },
      { value: -220, label: "100年" },
      { value: -240, label: "1000年" },
      { value: -260, label: "永久" }
    ]
  }
];


export const bloodParameters = [
    {
      mainKey: "investment", // 主參數名稱
      label: "獻血",
      options: [
        { value: 5, label: "1d10" },
        { value: 10, label: "2d10" },
        { value: 15, label: "4d10" },
        { value: 20, label: "8d10" },
        { value: 25, label: "16d10" },
        { value: 30, label: "32d10" }
      ]
    },
    {
      mainKey: "critical", // 主參數名稱
      label: "承受重擊",
      options: [
        { value: 20, label: "A" },
        { value: 40, label: "B" },
        { value: 60, label: "C" },
        { value: 80, label: "D" },
        { value: 100, label: "E" }
      ]
    }
  ];

export const investingTimeParameters = [
  {
    mainKey: "castingTime", // 主參數名稱
    label: "施法時間",
    options: [
      { value: 0, label: "3分鐘", note: "（注：最短儀式施法時間）" },
      { value: 5, label: "7分鐘" },
      { value: 10, label: "30分鐘" },
      { value: 15, label: "1小時" },
      { value: 20, label: "2小時" },
      { value: 25, label: "4小時" },
      { value: 30, label: "8小時", note: "常規(+30)" },
      { value: 35, label: "16小時", note: "常規(+30)、常規(+30)" },
      { value: 40, label: "24小時", note: "常規(+30)、常規(+30)、簡單(+20)" },
      { value: 45, label: "3天", note: "常規(+30)、常規(+30)、簡單(+20)、中等(+0)" },
      { value: 50, label: "7天", note: "常規(+30)、常規(+30)、簡單(+20)、中等(+0)、困難(-10)" },
      { value: 55, label: "9天", note: "常規(+30)、常規(+30)、簡單(+20)、中等(+0)、困難(-10)、困難(-10)" },
      { value: 60, label: "1月", note: "常規(+30)、常規(+30)、簡單(+20)、中等(+0)、困難(-10)、困難(-10)、非常難(-20)" },
      { value: 65, label: "3月", note: "常規(+30)、常規(+30)、簡單(+20)、中等(+0)、困難(-10)、困難(-10)、非常難(-20)、非常難(-20)" },
      { value: 70, label: "1年", note: "常規(+30)、常規(+30)、簡單(+20)、中等(+0)、困難(-10)、困難(-10)、非常難(-20)、非常難(-20)、極其困難(-30)" }
    ]
  }
];

export const ritualModifiersParameters = [
  {
    mainKey: "knowledgeOfSpellList", // 主參數名稱
    label: "法術知識列表",
    options: [
      { value: -50, label: "施法者不知施放的法術屬於哪個法術列表" },
      { value: -30, label: "施法者知道列表，但不知法術等級" },
      { value: 0, label: "施法者知道列表，還有法術等級" },
    ]
  },
  {
    mainKey: "spellListType", // 主參數名稱
    label: "法術列表類型",
    options: [
      { value: 10, label: "施法者自身的基本列表" },
      { value: 0, label: "法術是開放列表" },
      { value: -10, label: "法術是封閉列表" },
      { value: -20, label: "法術是邪惡列表（且施法者已學會其他邪惡列表）" },
      { value: -40, label: "法術是基本列表" },
      { value: -50, label: "法術是邪惡列表（且施法者未學會其他邪惡列表）" },
      { value: -50, label: "法術並非來自施法者自己的領域" }
    ]
  },
  {
    mainKey: "PPSources", // 主參數名稱
    label: "PP來源",
    options: [
      { value: 0, label: "儀式使用1個領域的PP" },
      { value: -10, label: "儀式使用2個領域的PP" },
      { value: -25, label: "儀式使用3個領域的PP" }
    ]
  },
];
