# 沉 · 桌宠搭建指南

一只深蓝紫的小水母，住在你的安卓屏幕上。大脑（AI）和身体（桌宠 APK）分离，
通过 Supabase 通信。

## 一、Supabase（通信中转，约 10 分钟）

1. 注册 [supabase.com](https://supabase.com)（免费版即可）
2. New project → 记住项目的 **URL** 和 **anon key**（Settings → API）
3. SQL Editor → 粘贴 `supabase.sql` 全部内容 → Run

## 二、桌宠 APK（身体）

### 方案 A：直接用本仓库的 Actions 构建（推荐）
1. 打开 **Actions** 标签页 → **Build APK** 工作流 → 等绿色对勾
2. Artifacts 里下载 `app-debug-apk` → 解压 → 安装 `app-debug.apk`

> 注意：如果 fork 后发现 Actions 没自动跑，去 Actions 页面对 workflow 点 enable。

### 方案 B：本地构建
```bash
git clone https://github.com/<你的账号>/AI-Live-Overflow-Android-APK.git
cd AI-Live-Overflow-Android-APK
./gradlew assembleDebug
# 产物：app/build/outputs/apk/debug/app-debug.apk
```

### 手机授权（装完必做）
- 悬浮窗权限（设置里手动开）
- 使用情况访问权限（桌宠才能知道你打开了什么 app）
- 通知权限
- 电池优化白名单（华为/荣耀还要开"自启动"，否则后台被杀）

## 三、接线（身体连大脑）

桌宠的 Android 代码里找 Supabase 配置处，填入：
- 你的 Supabase URL
- anon key

配置后桌宠会：
- 实时监听 `clawd_state` 表 → 我写的情绪/气泡立刻显示在屏幕上
- 把点击、截图、前台 app 等事件写进 `pet_events` 表 → 我读得到

## 四、大脑（AI）侧协议

### 我 → 桌宠（写 clawd_state）
```json
{ "mood": "happy", "bubble": "想我没", "heat": 30 }
```
- `mood`: normal / happy / shy / sleep / poke
- `bubble`: 要显示的气泡文字（留空则只说 mood 不弹气泡）

### 桌宠 → 我（读 pet_events）
```json
{ "type": "tap", "payload": "", "created_at": "..." }
{ "type": "app_changed", "payload": "com.ss.android.ugc.aweme", ... }
```

## 五、素材

- 水母本体：`app/src/main/assets/pet.html`（像素 SVG，10px 一格）
- 动画/配色：`pet.css`
- 台词：`pet.js`（"沉"的话都在这里，想改语气改这里）

形象：深蓝紫像素水母，六根带光点的触手，默认慵懒半闭眼；
状态有正常 / 开心（弯眼+腮红）/ 睡觉 / 害羞（O 嘴+腮红）。