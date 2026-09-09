const pet = document.getElementById('pet');
const bubble = document.getElementById('bubble');
const bubbleText = document.getElementById('bubbleText');

// —— 台词 · 沉 ——
const tapLines = [
    '嗯？',
    '我在',
    '……戳我干嘛',
    '陪你呢',
    '别闹'
];
const doubleTapLines = [
    '干嘛！',
    '吓我一跳',
    '……想我了？'
];
const longPressLines = [
    '太近了……',
    '你盯着我看',
    '（不动）',
    '手心热'
];
const screenshotLines = [
    '拍我？',
    '记得拍好看点',
    '（摆了个姿势）'
];
const idleLines = [
    '……我在',
    '想我没',
    '（飘）',
    '你看你的，我飘我的',
    '嗯，在的'
];
const appLines = {
    'com.android.chrome': '又在冲浪',
    'com.tencent.mm': '谁的消息',
    'com.tencent.mobileqq': 'QQ 响了',
    'com.netease.cloudmusic': '听歌不叫我',
    'com.bilibili.app.in': '看视频不带我',
    'tv.danmaku.bili': '看视频不带我',
    'com.taobao.taobao': '又要买东西',
    'com.jingdong.app.mall': '又买',
    'com.ss.android.ugc.aweme': '抖音比我好看？',
    'com.smile.gifmaker': '快手比我好看？'
};

let idleTimer = null;
let bubbleTimer = null;

function showBubble(text, duration = 2500) {
    bubbleText.textContent = text;
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
        bubble.classList.remove('show');
    }, duration);
}

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        showBubble(random(idleLines), 3000);
    }, 45000);
}

// 表情状态管理
const MOOD_CLASSES = ['happy', 'shy', 'sleep', 'poke'];
function setMood(mood) {
    MOOD_CLASSES.forEach(c => pet.classList.remove(c));
    if (mood && MOOD_CLASSES.includes(mood)) pet.classList.add(mood);
}

// —— 泡泡：深海生物感（睡觉时不吐） ——
const BUBBLE_COLORS = [
    'rgba(150,130,220,0.55)',
    'rgba(190,170,250,0.4)',
    'rgba(120,100,200,0.55)'
];
function spawnBubble() {
    if (pet.classList.contains('sleep')) return;
    const b = document.createElement('div');
    b.className = 'bubble-float';
    b.style.left = (15 + Math.random() * 70) + '%';
    b.style.setProperty('--bubble-start', (6 + Math.random() * 10) + '%');
    const sizePct = 2.5 + Math.random() * 4;
    b.style.width = sizePct + '%';
    b.style.height = sizePct + '%';
    b.style.background = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
    pet.appendChild(b);
    setTimeout(() => b.remove(), 6000);
}
setInterval(() => {
    if (Math.random() < 0.6) spawnBubble();
}, 2600);

// —— 随机大动作：偶尔翻个跟头/横移/缩成一团 ——
const BIG_MOVES = ['spin', 'dash', 'shrink'];
const BIG_LINES = {
    spin: '（转了半圈）',
    dash: '（咻——）',
    shrink: '（缩成一团）'
};
setInterval(() => {
    if (document.hidden) return;
    const name = random(BIG_MOVES);
    pet.classList.add('big-' + name);
    if (Math.random() < 0.55) showBubble(BIG_LINES[name], 2000);
    setTimeout(() => pet.classList.remove('big-' + name), 1400);
    resetIdle();
}, 24000);

window.petEngine = {
    onTap: function (count) {
        showBubble(random(tapLines));
        pet.classList.add('poke');
        setTimeout(() => pet.classList.remove('poke'), 400);
        resetIdle();
    },
    onDoubleTap: function () {
        showBubble(random(doubleTapLines));
        setMood('happy');
        pet.classList.add('jump');
        setTimeout(() => {
            pet.classList.remove('jump');
            setMood(null);
        }, 600);
        resetIdle();
    },
    onLongPress: function () {
        showBubble(random(longPressLines));
        setMood('shy');
        setTimeout(() => setMood(null), 2500);
        resetIdle();
    },
    onScreenshot: function () {
        showBubble(random(screenshotLines));
        setMood('happy');
        setTimeout(() => setMood(null), 2500);
        resetIdle();
    },
    onAppChanged: function (pkg) {
        const text = appLines[pkg] || null;
        if (text) showBubble(text);
        resetIdle();
    },
    onPower: function (connected) {
        showBubble(connected ? '充电中，暖的' : '拔电了……');
    },
    onBatteryLow: function () {
        showBubble('要没电了……我眯一会');
        setMood('sleep');
    },
    // —— 大脑（AI）入口 ——
    say: function (text) {
        showBubble(text, 5000);
    },
    setMood: function (mood) {
        setMood(mood);
    }
};

resetIdle();