export function parseInput(input) {
  // 使用 🔷 分割每一段
  const parts = input.split('🔷').map(part => part.trim());
  const ignoreEmojis = ['✊', '🛠️', '😵', '🌊', '👎', '🕸️', '✴️', '💀'];
  const regex = /([^\s,]+(?:\[\-?\d+\])?)/g;

  let symbols = [];

  parts.forEach(part => {
    // 個別處理每一段
    const cleanedPart = part.replace(/.*[。！]/, ''); // 忽略 "。" 和 "！" 之前的所有文字
    const matches = cleanedPart.match(regex);

    if (matches) {
      // 確保複數組合之間有 ","
      matches.forEach((match, index) => {
        if (index > 0 && !matches[index - 1].endsWith(',')) {
          matches[index - 1] += ',';
        }
      });

      // 過濾掉包含 ignoreEmojis 的項目
      symbols = symbols.concat(matches.filter(match => !ignoreEmojis.some(emoji => match.includes(emoji))));
    }
  });

  return { symbols: symbols.map(symbol => symbol.replace(/,$/, '')) };
}

export function calculatePlayerStats(player) {
  calculateDizzyStacks(player);
  calculateFatigue(player);
  calculateInjury(player);
  calculateBleeding(player);
}

export function calculateDizzyStacks(player) {
  player.dizzyStacks75 = 0;
  player.dizzyStacks50 = 0;
  player.dizzyStacks25 = 0;
  player.symbolEntries.forEach(entry => {
    const match75 = entry.text.match(/(\d*)💫\[-75\]/);
    const match50 = entry.text.match(/(\d*)💫\[-50\]/);
    const match25 = entry.text.match(/(\d*)💫\[-25\]/);
    if (match75) {
      player.dizzyStacks75 += match75[1] ? parseInt(match75[1]) : 1;
    }
    if (match50) {
      player.dizzyStacks50 += match50[1] ? parseInt(match50[1]) : 1;
    }
    if (match25) {
      player.dizzyStacks25 += match25[1] ? parseInt(match25[1]) : 1;
    }
  });
}
  
export function calculateFatigue(player) {
  let currentTotalFatigue = 0;
  let currentExcessFatigue = 0;
  player.symbolEntries.forEach(entry => {
    const match = entry.text.match(/💦\((\-?\d+)\)/);
    if (match) {
      const value = parseInt(match[1]);
      if (currentTotalFatigue + value >= -50) {
        currentTotalFatigue += value;
      } else {
        const remainingValue = -50 - currentTotalFatigue;
        currentTotalFatigue = -50;
        currentExcessFatigue += Math.abs(value - remainingValue);
      }
    }
  });
  player.totalFatigue = currentTotalFatigue;
  player.excessFatigue = currentExcessFatigue;
}
  
export function calculateInjury(player) {
  let currentTotalInjury = 0;
  player.symbolEntries.forEach(entry => {
    if (!entry.text.includes('💦') && !entry.text.includes('💫')) {
      const match = entry.text.match(/-\d+/);
      if (match) {
        currentTotalInjury += parseInt(match[0]);
      }
    }
  });
  player.totalInjury = currentTotalInjury;
}
  
export function calculateBleeding(player) {
  let currentTotalBleeding = 0;
  player.symbolEntries.forEach(entry => {
    const match = entry.text.match(/🩸(\d+)/);
    if (match) {
      currentTotalBleeding += parseInt(match[1]);
    }
  });
  player.totalBleeding = currentTotalBleeding;
}
  
export function calculateTotalReduction(player) {
  let dizzyReduction = 0;
  if (player.dizzyStacks75 > 0) {
    dizzyReduction = -75;
  } else if (player.dizzyStacks50 > 0) {
    dizzyReduction = -50;
  } else if (player.dizzyStacks25 > 0) {
    dizzyReduction = -25;
  }
  return player.totalFatigue + player.totalInjury + -(player.excessFatigue) + dizzyReduction;
}