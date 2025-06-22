const content = `
<style>
    .form-group {
        margin-bottom: 10px;
    }
    label {
        font-weight: bold;
    }
</style>
<form id="dice-form">
    <div class="form-group">
        <label>輸入加減值：</label>
        <input value="" type="text" name="modifier">
    </div>
</form>
`;

let d = new Dialog({
    title: "2D6 擲骰檢定",
    content: content,
    buttons: {
        roll: {
            label: "擲骰",
            callback: async (html) => {
                const modifierInput = html.find('[name="modifier"]').val() || "0";
                const mod = eval(modifierInput); // 解析 ± 符號

                const roll = await new Roll("2d6").roll({async: true});
                await game.dice3d?.showForRoll(roll);

                const total = roll.total + mod;

                let result = "";
                if (total >= 10) {
                    result = "✅ 成功";
                } else if (total >= 7) {
                    result = "⚠️ 有代價的成功";
                } else {
                    result = "❌ 失敗";
                }

                const message = `
                    <h2>2D6 擲骰檢定</h2>
                    <strong>擲骰結果：${roll.total}</strong><br>
                    <strong>修正值：${mod >= 0 ? "+" + mod : mod}</strong><br>
                    <strong>總計：${total}</strong><br>
                    <hr>
                    <strong style="font-size: 16px;">${result}</strong>
                `;

                ChatMessage.create({
                    user: game.user.id,
                    speaker: ChatMessage.getSpeaker(),
                    content: message
                });
            }
        },
        cancel: {
            label: "取消"
        }
    },
    default: "roll"
});
d.render(true);