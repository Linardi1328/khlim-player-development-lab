export const LOCALE_COOKIE = "khlim_locale";

export const localeOptions = [
  { value: "en", label: "English", shortLabel: "EN" },
  { value: "ms", label: "Bahasa Melayu", shortLabel: "BM" },
  { value: "zh-CN", label: "简体中文", shortLabel: "中文" },
] as const;

export type Locale = (typeof localeOptions)[number]["value"];

export function normalizeLocale(value: string | null | undefined): Locale {
  return localeOptions.some((option) => option.value === value)
    ? (value as Locale)
    : "en";
}

const ms: Record<string, string> = {
  Language: "Bahasa",
  "Main navigation": "Navigasi utama",
  Assessments: "Penilaian",
  Measurements: "Ukuran",
  Goals: "Matlamat",
  Training: "Latihan",
  Feedback: "Maklum balas",
  "Create goal": "Cipta matlamat",
  "Record session": "Rekod sesi",
  "Edit profile": "Edit profil",
  "ATHLETE DEVELOPMENT PROFILE": "PROFIL PERKEMBANGAN ATLET",
  "YOUR DEVELOPMENT JOURNEY": "PERJALANAN PERKEMBANGAN ANDA",
  "Saved. Your development profile is up to date.":
    "Disimpan. Profil perkembangan anda telah dikemas kini.",
  "Development sections": "Bahagian perkembangan",
  "Every check-in adds to the story.":
    "Setiap semakan menambah kepada perjalanan.",
  "The numbers behind the practice.": "Nombor di sebalik latihan.",
  "Clear intentions. Observable progress.":
    "Niat yang jelas. Kemajuan yang boleh diperhatikan.",
  "The everyday work that makes a difference.":
    "Usaha harian yang membawa perubahan.",
  "Observations, encouragement and the next step.":
    "Pemerhatian, galakan dan langkah seterusnya.",
  "Sign out failed. Try again.": "Log keluar gagal. Cuba lagi.",
  "Save assessment": "Simpan penilaian",
  "Save measurement": "Simpan ukuran",
  "Save goal": "Simpan matlamat",
  "Save training session": "Simpan sesi latihan",
  "Save coach feedback": "Simpan maklum balas jurulatih",
  "Goal status": "Status matlamat",
  "Could not update status. Try again.":
    "Tidak dapat mengemas kini status. Cuba lagi.",
  "1 · Exploring": "1 · Meneroka",
  "2 · Developing": "2 · Berkembang",
  "3 · Consistent": "3 · Konsisten",
  "4 · Confident": "4 · Yakin",
  "5 · Advanced": "5 · Lanjutan",
  "Free throws": "Balingan percuma",
  "Vertical jump": "Lompatan menegak",
  "20 m sprint": "Pecut 20 m",
  "Skill work": "Latihan kemahiran",
  "Team practice": "Latihan pasukan",
  "Strength & conditioning": "Kekuatan & kecergasan",
  "Game review": "Ulasan permainan",
  Overview: "Gambaran keseluruhan",
  "Athlete roster": "Senarai atlet",
  "My development": "Perkembangan saya",
  "Skip to content": "Langkau ke kandungan",
  "THE DEVELOPMENT LAB": "MAKMAL PERKEMBANGAN",
  "A space to get better.": "Ruang untuk menjadi lebih baik.",
  "Small steps. Consistent practice. Progress that lasts.":
    "Langkah kecil. Latihan konsisten. Kemajuan yang berkekalan.",
  Coach: "Jurulatih",
  Athlete: "Atlet",
  "Lab account": "Akaun makmal",
  "Sign out": "Log keluar",
  "Synthetic data": "Data sintetik",
  Prototype: "Prototaip",
  "Built for development. Designed for possibility.":
    "Dibina untuk perkembangan. Direka untuk kemungkinan.",
  "KHLIM Labs · Experimental prototype": "KHLIM Labs · Prototaip eksperimen",
  "Email address": "Alamat e-mel",
  Password: "Kata laluan",
  "Sign in to the lab": "Log masuk ke makmal",
  "Show password": "Tunjukkan kata laluan",
  "Hide password": "Sembunyikan kata laluan",
  "Forgot password?": "Lupa kata laluan?",
  "Welcome to the lab.": "Selamat datang ke makmal.",
  "Sign in to see the work behind the progress.":
    "Log masuk untuk melihat usaha di sebalik kemajuan.",
  "Explore with a lab account": "Terokai dengan akaun makmal",
  "All athletes and records are fictional.":
    "Semua atlet dan rekod adalah rekaan.",
  "An isolated prototype. Please do not enter real athlete or personal information.":
    "Prototaip terpencil. Jangan masukkan maklumat atlet sebenar atau maklumat peribadi.",
  "PLAYER DEVELOPMENT LAB": "MAKMAL PERKEMBANGAN PEMAIN",
  "Better players.": "Pemain yang lebih baik.",
  "One practice": "Satu latihan",
  "at a time.": "pada satu masa.",
  "A place to see the progress, celebrate the effort, and build what comes next.":
    "Tempat untuk melihat kemajuan, menghargai usaha dan membina langkah seterusnya.",
  Observe: "Perhati",
  Develop: "Bangunkan",
  Reflect: "Renung",
  "An experiment in long-term athlete development":
    "Eksperimen dalam perkembangan atlet jangka panjang",
  "Athlete name": "Nama atlet",
  "Development group": "Kumpulan perkembangan",
  "Jersey number": "Nombor jersi",
  "Playing position": "Posisi permainan",
  "Current development focus": "Fokus perkembangan semasa",
  "Use a fictional name. This lab contains synthetic athletes only.":
    "Gunakan nama rekaan. Makmal ini hanya mengandungi atlet sintetik.",
  "A clear, encouraging focus for the athlete’s next stage.":
    "Fokus yang jelas dan menggalakkan untuk peringkat seterusnya atlet.",
  "Developing all-rounder": "Pemain serba boleh yang sedang berkembang",
  Guard: "Guard",
  Wing: "Wing",
  Forward: "Forward",
  Center: "Center",
  "Create athlete": "Cipta atlet",
  "Save profile": "Simpan profil",
  Cancel: "Batal",
  "Assessment date": "Tarikh penilaian",
  "Assessment notes": "Nota penilaian",
  "Describe the observed skills and the next area to practice.":
    "Terangkan kemahiran yang diperhatikan dan bidang seterusnya untuk dilatih.",
  Shooting: "Shooting",
  Finishing: "Finishing",
  "Ball handling": "Kawalan bola",
  Passing: "Hantaran",
  Defense: "Pertahanan",
  Rebounding: "Rebound",
  Athleticism: "Keupayaan atletik",
  Metric: "Metrik",
  "Measured date": "Tarikh ukuran",
  "Measurement protocol": "Protokol ukuran",
  "Goal title": "Tajuk matlamat",
  "Due date": "Tarikh sasaran",
  "Success target": "Sasaran kejayaan",
  "Make it observable, such as 8 of 10 off-hand layups.":
    "Jadikan ia boleh diperhatikan, contohnya 8 daripada 10 layup tangan bukan dominan.",
  Status: "Status",
  "Practice plan": "Pelan latihan",
  "Session date": "Tarikh sesi",
  "Session type": "Jenis sesi",
  "Duration (minutes)": "Tempoh (minit)",
  "Session notes": "Nota sesi",
  "Feedback for the athlete": "Maklum balas untuk atlet",
  "Celebrate something specific and offer one clear next step. This is visible to the athlete.":
    "Raikan sesuatu yang khusus dan berikan satu langkah seterusnya yang jelas. Ini boleh dilihat oleh atlet.",
  "Draft with AI": "Draf dengan AI",
  "Drafting…": "Sedang menyediakan draf…",
  "AI draft": "Draf AI",
  "Review and edit this suggestion before saving.":
    "Semak dan ubah cadangan ini sebelum menyimpan.",
  "Saving…": "Menyimpan…",
  Update: "Kemas kini",
  Saved: "Disimpan",
  "Not started": "Belum bermula",
  "In progress": "Sedang berjalan",
  Completed: "Selesai",
  "THE BIG PICTURE": "GAMBARAN BESAR",
  "Every practice counts.": "Setiap latihan bermakna.",
  "Add athlete": "Tambah atlet",
  "THE LONG GAME": "PERJALANAN JANGKA PANJANG",
  "See the player.": "Lihat pemain.",
  "Build the potential.": "Bina potensi.",
  "Turn small improvements into a clearer picture of every athlete’s journey.":
    "Jadikan peningkatan kecil sebagai gambaran yang lebih jelas tentang perjalanan setiap atlet.",
  "Explore your roster": "Terokai senarai atlet",
  "Athletes in development": "Atlet dalam perkembangan",
  "Across U9, U12 and U15": "Merentasi U9, U12 dan U15",
  "Development check-ins": "Semakan perkembangan",
  "Individual snapshots over time": "Gambaran individu dari semasa ke semasa",
  "Goals in motion": "Matlamat yang sedang berjalan",
  "Small steps with a clear purpose": "Langkah kecil dengan tujuan yang jelas",
  "Sessions this month": "Sesi bulan ini",
  "Recorded in the last 30 days": "Direkodkan dalam 30 hari terakhir",
  "A PLACE FOR EVERY STAGE": "RUANG UNTUK SETIAP PERINGKAT",
  "Your development groups": "Kumpulan perkembangan anda",
  "Full roster": "Senarai penuh",
  Foundation: "Asas",
  Development: "Perkembangan",
  Performance: "Prestasi",
  "Find the joy. Build the basics.": "Temui keseronokan. Bina asas.",
  "Grow skills. Build confidence.": "Kembangkan kemahiran. Bina keyakinan.",
  "Refine the details. Own the work.": "Perhalusi butiran. Miliki usaha.",
  "BACK ON THE COURT": "KEMBALI KE GELANGGANG",
  "Recent training": "Latihan terkini",
  "The court is ready": "Gelanggang sudah sedia",
  "Record a session from an athlete’s profile.":
    "Rekod sesi daripada profil atlet.",
  "ONE STEP AT A TIME": "SATU LANGKAH PADA SATU MASA",
  "Coming into focus": "Semakin jelas",
  "Room for a new goal": "Ruang untuk matlamat baharu",
  "Set a specific next step from an athlete profile.":
    "Tetapkan langkah seterusnya yang khusus daripada profil atlet.",
  "COACH’S REMINDER": "PERINGATAN JURULATIH",
  "Progress belongs to the player. Keep the conversation personal.":
    "Kemajuan milik pemain. Kekalkan perbualan secara peribadi.",
  "INDIVIDUAL JOURNEYS. SHARED COMMITMENT.":
    "PERJALANAN INDIVIDU. KOMITMEN BERSAMA.",
  "Know the person behind the player. Find their next step.":
    "Kenali individu di sebalik pemain. Cari langkah seterusnya.",
  "Search athletes": "Cari atlet",
  "Search by athlete name…": "Cari mengikut nama atlet…",
  "All groups": "Semua kumpulan",
  "Apply filters": "Gunakan penapis",
  Clear: "Kosongkan",
  "CURRENT FOCUS": "FOKUS SEMASA",
  "Ready for a first check-in": "Sedia untuk semakan pertama",
  "No athletes found": "Tiada atlet ditemui",
  "Clear filters": "Kosongkan penapis",
  "Try a different name or development group.":
    "Cuba nama atau kumpulan perkembangan yang lain.",
  "THE CURRENT PICTURE": "GAMBARAN SEMASA",
  "Skill development": "Perkembangan kemahiran",
  "New check-in": "Semakan baharu",
  History: "Sejarah",
  "Latest check-in": "Semakan terkini",
  "1 Exploring → 5 Advanced · Individual coaching observations":
    "1 Meneroka → 5 Lanjutan · Pemerhatian jurulatih individu",
  "Let’s find the starting point": "Mari cari titik permulaan",
  "Record assessment": "Rekod penilaian",
  "The first assessment will bring this skill picture to life.":
    "Penilaian pertama akan membentuk gambaran kemahiran ini.",
  "THE LONG VIEW": "PANDANGAN JANGKA PANJANG",
  "Progress over time": "Kemajuan dari semasa ke semasa",
  "Average of this athlete’s seven skill observations":
    "Purata tujuh pemerhatian kemahiran atlet ini",
  "Explore assessment history": "Terokai sejarah penilaian",
  "Progress takes a starting point": "Kemajuan memerlukan titik permulaan",
  "Check-ins will appear here over time.":
    "Semakan akan muncul di sini dari semasa ke semasa.",
  "No measurement yet": "Belum ada ukuran",
  "PRACTICE WITH PURPOSE": "LATIHAN DENGAN TUJUAN",
  "All goals": "Semua matlamat",
  "FROM THE SIDELINE": "DARI TEPI GELANGGANG",
  "Coach’s corner": "Sudut jurulatih",
  "All feedback": "Semua maklum balas",
  "Last time on the court": "Kali terakhir di gelanggang",
  "No sessions recorded yet.": "Belum ada sesi direkodkan.",
  "A fresh space for your next step": "Ruang baharu untuk langkah seterusnya",
  "Your next goal starts here": "Matlamat seterusnya bermula di sini",
  "Set a goal": "Tetapkan matlamat",
  "Create a specific, achievable goal for this athlete.":
    "Cipta matlamat khusus yang boleh dicapai untuk atlet ini.",
  "Your coach will add a clear next step here.":
    "Jurulatih anda akan menambah langkah seterusnya yang jelas di sini.",
  "THE TARGET": "SASARAN",
  "Review due": "Perlu disemak",
  "Current assessment": "Penilaian semasa",
  "Past assessment": "Penilaian terdahulu",
  "View details +": "Lihat butiran +",
  "COACH’S OBSERVATIONS": "PEMERHATIAN JURULATIH",
  "No assessments yet": "Belum ada penilaian",
  "A first check-in will establish the starting point.":
    "Semakan pertama akan menetapkan titik permulaan.",
  "A baseline is the first step": "Garis asas ialah langkah pertama",
  "Record measurement": "Rekod ukuran",
  "Add a result and its measurement protocol to begin tracking progress.":
    "Tambah keputusan dan protokol ukuran untuk mula menjejaki kemajuan.",
  Higher: "Lebih tinggi",
  Lower: "Lebih rendah",
  "is better under comparable conditions":
    "lebih baik dalam keadaan yang setanding",
  "No results for this metric yet.": "Belum ada keputusan untuk metrik ini.",
  "Measurement history": "Sejarah ukuran",
  "Compare results using the same protocol. Shooting percentages use percentage points for changes.":
    "Bandingkan keputusan menggunakan protokol yang sama. Peratusan shooting menggunakan mata peratusan untuk perubahan.",
  "Ready for the next practice": "Sedia untuk latihan seterusnya",
  "Record training session": "Rekod sesi latihan",
  "Training notes connect the everyday work with long-term progress.":
    "Nota latihan menghubungkan usaha harian dengan kemajuan jangka panjang.",
  "Every effort deserves to be seen": "Setiap usaha wajar dihargai",
  "Add feedback": "Tambah maklum balas",
  "Specific, encouraging coach feedback will live here.":
    "Maklum balas jurulatih yang khusus dan menggalakkan akan dipaparkan di sini.",
  "Record an assessment.": "Rekod penilaian.",
  "Record a measurement.": "Rekod ukuran.",
  "Set a development goal.": "Tetapkan matlamat perkembangan.",
  "Record a training session.": "Rekod sesi latihan.",
  "Share coach feedback.": "Kongsi maklum balas jurulatih.",
  "A snapshot of today. A reference for tomorrow.":
    "Gambaran hari ini. Rujukan untuk esok.",
  "Give the next step a little more clarity.":
    "Jadikan langkah seterusnya lebih jelas.",
  "A shared 1–5 scale": "Skala 1–5 yang dikongsi",
  "1 Exploring · 2 Developing · 3 Consistent · 4 Confident · 5 Advanced":
    "1 Meneroka · 2 Berkembang · 3 Konsisten · 4 Yakin · 5 Lanjutan",
  "Rate against the athlete’s stage and the same observed drill conditions. These are coaching observations, not standardized scores.":
    "Nilai mengikut peringkat atlet dan keadaan latihan yang sama. Ini ialah pemerhatian jurulatih, bukan skor piawai.",
  "Reset your password": "Tetapkan semula kata laluan",
  "Enter your lab account email to continue.":
    "Masukkan e-mel akaun makmal anda untuk meneruskan.",
  "Send reset link": "Dapatkan pautan tetapan semula",
  "Back to sign in": "Kembali ke log masuk",
  "Choose a new password": "Pilih kata laluan baharu",
  "New password": "Kata laluan baharu",
  "Confirm password": "Sahkan kata laluan",
  "Reset password": "Tetapkan semula kata laluan",
  "Continue to reset password": "Teruskan untuk menetapkan semula kata laluan",
  "Password updated. You can sign in now.":
    "Kata laluan dikemas kini. Anda boleh log masuk sekarang.",
  "This local lab does not send email. The reset link is shown here for synthetic accounts only.":
    "Makmal tempatan ini tidak menghantar e-mel. Pautan tetapan semula dipaparkan di sini untuk akaun sintetik sahaja.",
  "Use at least 10 characters.": "Gunakan sekurang-kurangnya 10 aksara.",
  "Passwords do not match.": "Kata laluan tidak sepadan.",
};

const zh: Record<string, string> = {
  Language: "语言",
  "Main navigation": "主导航",
  Assessments: "评估",
  Measurements: "测量",
  Goals: "目标",
  Training: "训练",
  Feedback: "反馈",
  "Create goal": "创建目标",
  "Record session": "记录训练",
  "Edit profile": "编辑资料",
  "ATHLETE DEVELOPMENT PROFILE": "运动员发展档案",
  "YOUR DEVELOPMENT JOURNEY": "你的成长历程",
  "Saved. Your development profile is up to date.":
    "已保存。你的成长档案已更新。",
  "Development sections": "成长栏目",
  "Every check-in adds to the story.": "每次评估都记录成长。",
  "The numbers behind the practice.": "训练背后的数据。",
  "Clear intentions. Observable progress.": "目标清晰，进步可见。",
  "The everyday work that makes a difference.": "日常训练带来改变。",
  "Observations, encouragement and the next step.": "观察、鼓励与下一步。",
  "Sign out failed. Try again.": "退出失败，请重试。",
  "Save assessment": "保存评估",
  "Save measurement": "保存测量",
  "Save goal": "保存目标",
  "Save training session": "保存训练",
  "Save coach feedback": "保存教练反馈",
  "Goal status": "目标状态",
  "Could not update status. Try again.": "无法更新状态，请重试。",
  "1 · Exploring": "1 · 探索",
  "2 · Developing": "2 · 发展中",
  "3 · Consistent": "3 · 稳定",
  "4 · Confident": "4 · 自信",
  "5 · Advanced": "5 · 进阶",
  "Free throws": "罚球",
  "Vertical jump": "垂直弹跳",
  "20 m sprint": "20 米冲刺",
  "Skill work": "技能训练",
  "Team practice": "团队训练",
  "Strength & conditioning": "力量与体能",
  "Game review": "比赛复盘",
  Overview: "总览",
  "Athlete roster": "运动员名单",
  "My development": "我的成长",
  "Skip to content": "跳到主要内容",
  "THE DEVELOPMENT LAB": "成长实验室",
  "A space to get better.": "一个持续进步的空间。",
  "Small steps. Consistent practice. Progress that lasts.":
    "小步前进。持续训练。让进步更长久。",
  Coach: "教练",
  Athlete: "运动员",
  "Lab account": "实验室账户",
  "Sign out": "退出登录",
  "Synthetic data": "合成数据",
  Prototype: "原型",
  "Built for development. Designed for possibility.":
    "为成长而构建，为更多可能而设计。",
  "KHLIM Labs · Experimental prototype": "KHLIM Labs · 实验原型",
  "Email address": "电子邮箱",
  Password: "密码",
  "Sign in to the lab": "登录实验室",
  "Show password": "显示密码",
  "Hide password": "隐藏密码",
  "Forgot password?": "忘记密码？",
  "Welcome to the lab.": "欢迎来到实验室。",
  "Sign in to see the work behind the progress.":
    "登录查看进步背后的训练与记录。",
  "Explore with a lab account": "使用实验室账户体验",
  "All athletes and records are fictional.": "所有运动员和记录均为虚构数据。",
  "An isolated prototype. Please do not enter real athlete or personal information.":
    "这是隔离的实验原型。请勿输入真实运动员或个人信息。",
  "PLAYER DEVELOPMENT LAB": "球员发展实验室",
  "Better players.": "成为更好的球员。",
  "One practice": "一次训练",
  "at a time.": "一步一步。",
  "A place to see the progress, celebrate the effort, and build what comes next.":
    "看见进步，肯定努力，并规划下一步。",
  Observe: "观察",
  Develop: "成长",
  Reflect: "复盘",
  "An experiment in long-term athlete development": "长期运动员发展的实验",
  "Athlete name": "运动员姓名",
  "Development group": "发展组别",
  "Jersey number": "球衣号码",
  "Playing position": "场上位置",
  "Current development focus": "当前发展重点",
  "Use a fictional name. This lab contains synthetic athletes only.":
    "请使用虚构姓名。本实验室仅包含合成运动员数据。",
  "A clear, encouraging focus for the athlete’s next stage.":
    "为运动员下一阶段设定清晰且鼓励性的重点。",
  "Developing all-rounder": "发展中的全能型球员",
  Guard: "后卫",
  Wing: "侧翼",
  Forward: "前锋",
  Center: "中锋",
  "Create athlete": "创建运动员",
  "Save profile": "保存资料",
  Cancel: "取消",
  "Assessment date": "评估日期",
  "Assessment notes": "评估备注",
  "Describe the observed skills and the next area to practice.":
    "描述观察到的技能，以及下一步训练重点。",
  Shooting: "投篮",
  Finishing: "终结",
  "Ball handling": "控球",
  Passing: "传球",
  Defense: "防守",
  Rebounding: "篮板",
  Athleticism: "运动能力",
  Metric: "指标",
  "Measured date": "测量日期",
  "Measurement protocol": "测量方法",
  "Goal title": "目标标题",
  "Due date": "目标日期",
  "Success target": "成功标准",
  "Make it observable, such as 8 of 10 off-hand layups.":
    "让目标可观察，例如非惯用手上篮 10 次进 8 次。",
  Status: "状态",
  "Practice plan": "训练计划",
  "Session date": "训练日期",
  "Session type": "训练类型",
  "Duration (minutes)": "时长（分钟）",
  "Session notes": "训练备注",
  "Feedback for the athlete": "给运动员的反馈",
  "Celebrate something specific and offer one clear next step. This is visible to the athlete.":
    "肯定一个具体表现，并给出一个明确的下一步。运动员可以看到此反馈。",
  "Draft with AI": "AI 辅助起草",
  "Drafting…": "正在生成…",
  "AI draft": "AI 草稿",
  "Review and edit this suggestion before saving.":
    "保存前请先审核并编辑此建议。",
  "Saving…": "保存中…",
  Update: "更新",
  Saved: "已保存",
  "Not started": "未开始",
  "In progress": "进行中",
  Completed: "已完成",
  "THE BIG PICTURE": "整体概览",
  "Every practice counts.": "每一次训练都重要。",
  "Add athlete": "添加运动员",
  "THE LONG GAME": "长期成长",
  "See the player.": "看见球员。",
  "Build the potential.": "培养潜力。",
  "Turn small improvements into a clearer picture of every athlete’s journey.":
    "把每一次小进步汇集成清晰的成长轨迹。",
  "Explore your roster": "查看运动员名单",
  "Athletes in development": "发展中的运动员",
  "Across U9, U12 and U15": "覆盖 U9、U12 和 U15",
  "Development check-ins": "成长评估记录",
  "Individual snapshots over time": "持续记录个人成长",
  "Goals in motion": "进行中的目标",
  "Small steps with a clear purpose": "目标明确的小步前进",
  "Sessions this month": "本月训练",
  "Recorded in the last 30 days": "过去 30 天内记录",
  "A PLACE FOR EVERY STAGE": "每个阶段都有位置",
  "Your development groups": "你的发展组别",
  "Full roster": "完整名单",
  Foundation: "基础",
  Development: "发展",
  Performance: "表现",
  "Find the joy. Build the basics.": "找到乐趣，打好基础。",
  "Grow skills. Build confidence.": "提升技能，建立信心。",
  "Refine the details. Own the work.": "打磨细节，为训练负责。",
  "BACK ON THE COURT": "回到球场",
  "Recent training": "近期训练",
  "The court is ready": "球场已经准备好",
  "Record a session from an athlete’s profile.": "从运动员档案中记录训练。",
  "ONE STEP AT A TIME": "一步一步",
  "Coming into focus": "目标逐渐清晰",
  "Room for a new goal": "可以设定新目标",
  "Set a specific next step from an athlete profile.":
    "从运动员档案中设定明确的下一步。",
  "COACH’S REMINDER": "教练提醒",
  "Progress belongs to the player. Keep the conversation personal.":
    "成长属于球员。让沟通保持个人化。",
  "INDIVIDUAL JOURNEYS. SHARED COMMITMENT.": "不同成长轨迹，共同投入。",
  "Know the person behind the player. Find their next step.":
    "了解球员背后的个人，并找到下一步。",
  "Search athletes": "搜索运动员",
  "Search by athlete name…": "按运动员姓名搜索…",
  "All groups": "所有组别",
  "Apply filters": "应用筛选",
  Clear: "清除",
  "CURRENT FOCUS": "当前重点",
  "Ready for a first check-in": "准备进行第一次评估",
  "No athletes found": "未找到运动员",
  "Clear filters": "清除筛选",
  "Try a different name or development group.": "尝试其他姓名或发展组别。",
  "THE CURRENT PICTURE": "当前情况",
  "Skill development": "技能发展",
  "New check-in": "新增评估",
  History: "历史",
  "Latest check-in": "最新评估",
  "1 Exploring → 5 Advanced · Individual coaching observations":
    "1 探索 → 5 进阶 · 教练个人观察",
  "Let’s find the starting point": "先找到起点",
  "Record assessment": "记录评估",
  "The first assessment will bring this skill picture to life.":
    "第一次评估将建立技能起点。",
  "THE LONG VIEW": "长期视角",
  "Progress over time": "长期进步",
  "Average of this athlete’s seven skill observations":
    "该运动员七项技能观察的平均值",
  "Explore assessment history": "查看评估历史",
  "Progress takes a starting point": "成长需要一个起点",
  "Check-ins will appear here over time.": "后续评估会逐步显示在这里。",
  "No measurement yet": "尚无测量",
  "PRACTICE WITH PURPOSE": "有目标地训练",
  "All goals": "全部目标",
  "FROM THE SIDELINE": "来自场边",
  "Coach’s corner": "教练角",
  "All feedback": "全部反馈",
  "Last time on the court": "上一次训练",
  "No sessions recorded yet.": "尚无训练记录。",
  "A fresh space for your next step": "为下一步留出空间",
  "Your next goal starts here": "你的下一个目标从这里开始",
  "Set a goal": "设定目标",
  "Create a specific, achievable goal for this athlete.":
    "为运动员设定具体且可实现的目标。",
  "Your coach will add a clear next step here.":
    "教练会在这里添加清晰的下一步。",
  "THE TARGET": "目标标准",
  "Review due": "需要复查",
  "Current assessment": "当前评估",
  "Past assessment": "历史评估",
  "View details +": "查看详情 +",
  "COACH’S OBSERVATIONS": "教练观察",
  "No assessments yet": "尚无评估",
  "A first check-in will establish the starting point.":
    "第一次评估将建立起点。",
  "A baseline is the first step": "先建立基线",
  "Record measurement": "记录测量",
  "Add a result and its measurement protocol to begin tracking progress.":
    "添加结果和测量方法，开始追踪进步。",
  Higher: "更高",
  Lower: "更低",
  "is better under comparable conditions": "在可比条件下更好",
  "No results for this metric yet.": "该指标暂无结果。",
  "Measurement history": "测量历史",
  "Compare results using the same protocol. Shooting percentages use percentage points for changes.":
    "请使用相同方法比较结果。投篮百分比的变化使用百分点表示。",
  "Ready for the next practice": "准备下一次训练",
  "Record training session": "记录训练",
  "Training notes connect the everyday work with long-term progress.":
    "训练备注把日常训练和长期进步联系起来。",
  "Every effort deserves to be seen": "每一次努力都值得被看见",
  "Add feedback": "添加反馈",
  "Specific, encouraging coach feedback will live here.":
    "具体且鼓励性的教练反馈会显示在这里。",
  "Record an assessment.": "记录评估。",
  "Record a measurement.": "记录测量。",
  "Set a development goal.": "设定发展目标。",
  "Record a training session.": "记录训练。",
  "Share coach feedback.": "分享教练反馈。",
  "A snapshot of today. A reference for tomorrow.": "记录今天，参考明天。",
  "Give the next step a little more clarity.": "让下一步更清晰。",
  "A shared 1–5 scale": "统一的 1–5 评分",
  "1 Exploring · 2 Developing · 3 Consistent · 4 Confident · 5 Advanced":
    "1 探索 · 2 发展中 · 3 稳定 · 4 自信 · 5 进阶",
  "Rate against the athlete’s stage and the same observed drill conditions. These are coaching observations, not standardized scores.":
    "请结合运动员阶段，并在相同训练条件下评分。这些是教练观察，并非标准化分数。",
  "Reset your password": "重置密码",
  "Enter your lab account email to continue.": "输入实验室账户邮箱以继续。",
  "Send reset link": "获取重置链接",
  "Back to sign in": "返回登录",
  "Choose a new password": "设置新密码",
  "New password": "新密码",
  "Confirm password": "确认密码",
  "Reset password": "重置密码",
  "Continue to reset password": "继续重置密码",
  "Password updated. You can sign in now.": "密码已更新，现在可以登录。",
  "This local lab does not send email. The reset link is shown here for synthetic accounts only.":
    "本地实验室不会发送邮件。仅针对合成测试账户在此显示重置链接。",
  "Use at least 10 characters.": "请至少使用 10 个字符。",
  "Passwords do not match.": "两次输入的密码不一致。",
};

const dictionaries: Record<Exclude<Locale, "en">, Record<string, string>> = {
  ms,
  "zh-CN": zh,
};

const skipSelectors = [
  "script",
  "style",
  "textarea",
  "input",
  "[data-no-translate]",
  ".preserve-text",
  ".athlete-focus p",
  ".focus-banner p",
  ".focus-goal h3",
  ".athlete-card h2",
  ".athlete-card .position",
  ".goal-card h3",
  ".goal-card > p",
  ".goal-target p",
  ".feedback-feature blockquote",
  ".feedback-entry .preserve-text",
  ".measurement-entry > p",
].join(",");

export function shouldTranslateElement(element: Element | null) {
  return !element?.closest(skipSelectors);
}

function translateDynamic(locale: Locale, value: string): string | null {
  if (locale === "en") return null;
  const rules: Array<[RegExp, (match: RegExpMatchArray) => string]> = [
    [
      /^Checked in (.+)$/,
      (match) =>
        locale === "ms" ? `Disemak pada ${match[1]}` : `评估于 ${match[1]}`,
    ],
    [
      /^(\d+) active goals?$/,
      (match) =>
        locale === "ms"
          ? `${match[1]} matlamat aktif`
          : `${match[1]} 个进行中目标`,
    ],
    [
      /^(\d+) sessions?$/,
      (match) => (locale === "ms" ? `${match[1]} sesi` : `${match[1]} 次训练`),
    ],
    [
      /^Due (.+)$/,
      (match) =>
        locale === "ms" ? `Tarikh sasaran ${match[1]}` : `截止 ${match[1]}`,
    ],
    [
      /^Observed by (.+)$/,
      (match) =>
        locale === "ms"
          ? `Diperhatikan oleh ${match[1]}`
          : `观察教练：${match[1]}`,
    ],
    [
      /^Completed (.+)$/,
      (match) =>
        locale === "ms" ? `Selesai ${match[1]}` : `完成于 ${match[1]}`,
    ],
    [
      /^Welcome back, (.+)\. Here’s where development stands\.$/,
      (match) =>
        locale === "ms"
          ? `Selamat kembali, ${match[1]}. Ini perkembangan semasa.`
          : `欢迎回来，${match[1]}。这是目前的成长概况。`,
    ],
  ];
  for (const [pattern, render] of rules) {
    const match = value.match(pattern);
    if (match) return render(match);
  }
  return null;
}

export function translateUi(locale: Locale, value: string) {
  if (locale === "en" || !value.trim()) return value;
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const core = value.trim();
  const translated =
    dictionaries[locale][core] ?? translateDynamic(locale, core) ?? core;
  return `${leading}${translated}${trailing}`;
}

export function tr(locale: Locale, value: string) {
  return translateUi(locale, value).trim();
}
