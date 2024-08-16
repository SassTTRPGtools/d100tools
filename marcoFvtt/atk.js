const content = `

<style>
    .form-group {
        margin-bottom: 1px;
    }

    .form-group div {
        display: block;
        padding: 1px 0;
    }

    label {
        font-weight: bold;
    }
    
    .scrollable-content {
        overflow: auto;
        /*height: 400px; !* 調整高度，根據需要修改 *!*/
    }
</style>
<form id="" class="scrollable-content">
    <div class="form-group">
        <label>攻擊（填上每個±）</label>
        <input value="+0" type="text" name="total">
    </div>
    <div class="form-group">
        <label>重擊（填上每個±）</label>
        <input value="+0" type="text" name="cri_total">
    </div>
    <div class="form-group" style="background: gray;color:white;">
        <label>通用修改</label>
    </div>
    <div class="form-group">    
        <div>
                <input type="checkbox" id="副手(-20)" value="-20" name="OBMod" />
                <label for="副手(-20)">副手(-20)</label>
            </div>
        <div>
            <label>瞄準部位</label>
            <select name="hitLocationMod">
                <option value="+0" selected>不瞄準(+0)</option>
                <option value="-10">簡單(-10)</option>
                <option value="-25">普通(-25)</option>
                <option value="-50">很難(-50)</option>
            </select>
        </div>
    </div>
    <div class="form-group">   
            <div>
                <input type="checkbox" id="位於高地(+10)" value="+10" name="OBMod" />
                <label for="位於高地(+10)">位於高地(+10)</label>
            </div>
            <div>
                <input type="checkbox" id="敵人眩暈(+20)" value="+20" name="OBMod" />
                <label for="敵人眩暈(+20)">敵人眩暈(+20)</label>
            </div>
    </div>
    <div class="form-group">    
            <div>
                <input type="checkbox" id="*突襲敵人(+25)" value="+25" name="OBMod" />
                <label for="*突襲敵人(+25)">*突襲敵人(+25)</label>
            </div>
        <div>
            <label>受限戰鬥</label>
            <select name="restrictedQuartersMod">
                <option value="+0" selected>不影響(+0)</option>
                <option value="-25">靠近(-25)</option>
                <option value="-50">狹窄(-50)</option>
                <option value="-75">緊密(-75)</option>
                <option value="-100">貼合(-100)</option>
            </select>
        </div>
    </div>
    <div class="form-group" style="background: gray;color:white;">
        <label>近戰修改</label>
    </div>
    <div class="form-group">
        <div class="form-group">
            <label>僅近戰</label>
            <div>
                <input type="checkbox" id="處於伏地(-50)" value="-50" name="OBMod" />
                <label for="處於伏地(-50)">處於伏地(-50)</label>
            </div>
            <div>
                <input type="checkbox" id="目標伏地(+30)" value="+30" name="OBMod" />
                <label for="目標伏地(+30)">目標伏地(+30)</label>
            </div>
            <div>
                <input type="checkbox" id="使用2-H武器(+10)" value="+10" name="OBMod" />
                <label for="使用2-H武器(+10)">使用2-H武器(+10)</label>
            </div>
            <div style="padding: 16px;">
            </div>
        </div>
        <div class="form-group">
            <label>站位</label>
            <div>
                <input type="checkbox" id="從側翼攻擊(+15)" value="+15" name="OBMod" />
                <label for="從側翼攻擊(+15)">從側翼攻擊(+15)</label>
            </div>
            <div>
                <input type="checkbox" id="*從後方攻擊(+35)" value="+35" name="OBMod" />
                <label for="*從後方攻擊(+35)">*從後方攻擊(+35)</label>
            </div>
            <div>
                <input type="checkbox" id="攻擊側翼(-30)" value="-30" name="OBMod" />
                <label for="攻擊側翼(-30)">攻擊側翼(-30)</label>
            </div>
            <div>
                <input type="checkbox" id="攻擊後方(-70)" value="-70" name="OBMod" />
                <label for="攻擊後方(-70)">攻擊後方(-70)</label>
            </div>
        </div>  
    </div>
    <div class="form-group">
        <label style="color: red;">*措手不及：攻擊者對目標擁有突襲(+25)及從後方攻擊(+35)的好處</label>
    </div>    
    <div class="form-group" style="background: gray;color:white;">
        <label>遠程修改</label>
    </div>
    <div class="form-group">
            <div class="form-group">
            <label>目標狀態</label>
            <div>
                <input type="checkbox" id="伏地目標(-30)" value="-30" name="OBMod" />
                <label for="伏地目標(-30)">伏地目標(-30)</label>
            </div>
            <div>
                <input type="checkbox" id="處於敵人近戰內(-20)" value="-20" name="OBMod" />
                <label for="處於敵人近戰內(-20)">處於敵人近戰內(-20)</label>
            </div>
        </div>
        <div class="form-group">            
            <div>
                <label>射程</label>
                <select name="rangeMod">
                    <option value="+20" >抵近[10'](+20)</option>
                    <option value="+0" selected>短[x1射程](+0)</option>
                    <option value="-10">中[x2射程](-10)</option>
                    <option value="-25">遠[x3射程](-25)</option>
                    <option value="-50">極遠[x4射程](-50)</option>
                    <option value="-100">極限[x5射程](-100)</option>
                </select>
            </div>
        </div>  
    </div>
</form>


`;

let r = await new Roll(`1d100`).roll();
let RExplode = await new Roll(`1d100>=96x`).roll();
let hitroll = await new Roll("1d100").roll();

const myDialogOptions = {
    width: 400,
    // height: 400
};

let d = new Dialog({
    title: "攻擊檢定",
    content: content,
    buttons: {
        roll: {
            label: "確定", callback: (html) => {

                game.dice3d.showForRoll(r, game.user, true);
                let Xroll = r.total;
                RExplode.dice[0].options.appearance = {
                    colorset: "custom",
                    foreground: "#59CBE8",
                    background: "#000000",
                    outline: "#000000",
                    edge: "#59CBE8",
                    material: "glass",
                    font: "Luminari",
                    emissive: "#59CBE8",
                    system: "standard"
                };

                const checkedBoxes = html.find('input[name="OBMod"]:checked');
                const checkedValues = [];
                checkedBoxes.each((index, element) => {
                    checkedValues.push(element.value);
                });

                let html_total = html.find("[name=total]")[0].value;
                let html_OBMod = checkedValues.join('');
                let html_rangeMod = html.find("[name=rangeMod]")[0].value;
                let html_hitLocationMod = html.find("[name=hitLocationMod]")[0].value;
                let html_restrictedQuartersMod = html.find("[name=restrictedQuartersMod]")[0].value;


                let total_number = 0;
                let total_string = "";
                let total_string_css = "";
                let result_string = "";

                if (html_OBMod === "") html_OBMod = 0;
                if (html_total === "") html_total = 0;

                if (Xroll >= 96) {
                    game.dice3d.showForRoll(RExplode, game.user, true);
                    total_number = parseInt(Xroll) + parseInt(RExplode.total) + eval(html_total) + eval(html_OBMod) + eval(html_rangeMod) + eval(html_hitLocationMod) + eval(html_restrictedQuartersMod);
                    total_string = `${Xroll}(擲骰)+${RExplode.total}(擲骰)${html_total}(攻擊)`;
                    total_string_css = "color:green;";
                } else {
                    total_number = parseInt(Xroll) + eval(html_total) + eval(html_OBMod) + eval(html_rangeMod) + eval(html_hitLocationMod) + eval(html_restrictedQuartersMod);
                    total_string = `${Xroll}(擲骰)${html_total}(攻擊)`;
                }

                if(eval(html_OBMod)!==0){
                    total_string+=`${html_OBMod}(修改)`;
                }
                if(eval(html_rangeMod)!==0){
                    total_string+=`${html_rangeMod}(射程)`;
                }
                if(eval(html_hitLocationMod)!==0){
                    total_string+=`${html_hitLocationMod}(部位)`;
                }
                if(eval(html_restrictedQuartersMod)!==0){
                    total_string+=`${html_restrictedQuartersMod}(受限)`;
                }

                let cri_bouns = 0;
                if (total_number >= 180) {
                    cri_bouns = Math.floor((total_number - 175) / 5);
                }

                let total_cri_string = "";
                let html_cri_total = html.find("[name=cri_total]")[0].value;
                if (html_cri_total === "") html_cri_total = 0;


                let hitdice = hitroll.total + eval(html_cri_total) + cri_bouns;
                total_cri_string = `${hitroll.total}(擲骰)${html_cri_total}(修改)+${cri_bouns}(加重攻擊)`;
                const HitLocation = {
                    "Head": "命中頭部",
                    "Chest": "命中胸部",
                    "Abdomen": "命中腹部",
                    "LegLeft": "命中左腿部",
                    "LegRight": "命中右腿部",
                    "ArmLeft": "命中左手臂",
                    "ArmRight": "命中右手臂",
                }

                hitdice = (hitdice >= 100) ? 100 : hitdice;

                if (hitdice == 1 || (hitdice >= 16 && hitdice <= 20) || (hitdice >= 81 && hitdice <= 85) || hitdice >= 100) {
                    result_string = HitLocation.Head;
                } else if ((hitdice >= 2 && hitdice <= 3) || (hitdice >= 21 && hitdice <= 25) || (hitdice >= 76 && hitdice <= 80) || (hitdice >= 98 && hitdice <= 99)) {
                    result_string = HitLocation.Chest;
                } else if ((hitdice >= 4 && hitdice <= 5) || (hitdice >= 26 && hitdice <= 35) || (hitdice == 66) || (hitdice >= 96 && hitdice <= 97)) {
                    result_string = HitLocation.Abdomen;
                } else if ((hitdice >= 6 && hitdice <= 10) || (hitdice >= 36 && hitdice <= 45) || (hitdice >= 67 && hitdice <= 75) || (hitdice >= 91 && hitdice <= 95)) {
                    if (hitdice % 2 == 1) {
                        result_string = HitLocation.LegLeft;
                    } else {
                        result_string = HitLocation.LegRight;
                    }
                } else if ((hitdice >= 11 && hitdice <= 15) || (hitdice >= 46 && hitdice <= 55) || (hitdice >= 56 && hitdice <= 65) || (hitdice >= 86 && hitdice <= 90)) {
                    if (hitdice % 2 == 1) {
                        result_string = HitLocation.ArmLeft;
                    } else {
                        result_string = HitLocation.ArmRight;
                    }
                }

                if (Xroll == 66) {
                    result_string += " (異常事件)";
                } else if (Xroll == 33 || Xroll == 77) {
                    result_string += " (檢查損壞檢定)";
                }

                if (total_number <= 67) {
                    result_string = "完全失誤/除非是範圍法術";
                }


                message = `<h2>攻擊</h2>					
					<strong style="${total_string_css}">過程:${total_string}</strong><br>
					<strong>攻擊結果:${total_number}<br>
					<hr>
					<strong>過程:${total_cri_string}</strong><br>
					<strong>重擊結果:${hitdice}<br>
					<hr>
					<strong style="font-size:18px;">結果:${result_string}<br>`;


                ChatMessage.create({
                    user: game.user._id, speaker: ChatMessage.getSpeaker({token: actor}), content: message
                });
            }
        }
    },
    cancel: {
        label: "取消"
    },
    default: "cancel",
    render: html => console.log("Register interactivity in the rendered dialog"),
    close: html => console.log("This always is logged no matter which option is chosen")
}, myDialogOptions);
d.render(true);