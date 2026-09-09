-- ============================================================
-- 沉 · 桌宠 数据库初始化（Supabase SQL Editor 里跑一遍）
-- 大脑（AI）写 clawd_state，桌宠实时读取
-- 桌宠往 pet_events 上报事件，大脑轮询/实时读取
-- ============================================================

-- 1) 状态表：AI -> 桌宠（我写，它显示）
create table if not exists public.clawd_state (
  id bigint generated always as identity primary key,
  mood text not null default 'normal',          -- normal / happy / shy / sleep / poke
  bubble text not null default '',              -- 气泡里说的话
  heat int not null default 0,                  -- 0~100 热度
  updated_at timestamptz not null default now()
);

-- 2) 事件表：桌宠 -> AI（它上报，我读）
create table if not exists public.pet_events (
  id bigint generated always as identity primary key,
  type text not null,        -- tap / double_tap / long_press / screenshot / app_changed / power / battery_low / heartbeat
  payload text not null default '',   -- 比如 app_changed 时 payload 是包名
  created_at timestamptz not null default now()
);

-- 3) 让状态表走 Realtime（桌宠 WebSocket 实时收到变化）
alter publication supabase_realtime add table public.clawd_state;

-- 4) 权限：匿名 key 允许读状态表、写事件表（桌宠只用 anon key）
alter table public.clawd_state enable row level security;
alter table public.pet_events enable row level security;

create policy "anyone can read state" on public.clawd_state
  for select using (true);
create policy "anyone can insert events" on public.pet_events
  for insert with check (true);

-- 注意：如果 AI 侧要用 anon key 写状态，需要额外放开（默认建议 AI 用 service_role key 写状态，更安全）

-- 5) 初始行（确保桌宠启动时能读到一条状态）
insert into public.clawd_state (mood, bubble) values ('normal', '…我来了')
on conflict do nothing;
