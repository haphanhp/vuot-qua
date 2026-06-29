export type Lang = 'vi' | 'en'

export const strings = {
  vi: {
    // App
    appName: 'Vượt Qua',
    appTagline: 'Trợ lý cai nghiện AI',

    // Auth
    email: 'Email',
    password: 'Mật khẩu',
    signIn: 'Đăng nhập',
    signUp: 'Tạo tài khoản',
    rememberMe: 'Ghi nhớ đăng nhập',
    noAccount: 'Chưa có tài khoản? Đăng ký',
    hasAccount: 'Đã có tài khoản? Đăng nhập',

    // Language picker
    chooseLanguage: 'Chọn ngôn ngữ',
    langVI: '🇻🇳 Tiếng Việt',
    langEN: '🇺🇸 English',
    langDesc: 'Bạn có thể thay đổi sau trong cài đặt',

    // Nav
    navHome: 'Tổng quan',
    navCoach: 'Trò chuyện AI',
    navJournal: 'Nhật ký',
    navHistory: 'Lịch sử',
    navMilestones: 'Cột mốc',

    // Home
    streakDays: 'ngày sạch',
    currentStreak: 'Chuỗi ngày hiện tại',
    bestRecord: 'Kỷ lục cá nhân',
    iHaveCraving: '⚡ Tôi đang thèm — cần giúp ngay',
    cravingSubtext: 'Nhấn để bắt đầu kỹ thuật vượt cơn thèm',
    commonTriggers: 'Tác nhân thường gặp',
    triggerHelp: 'Nhận ra tác nhân giúp não chuẩn bị trước — không bị bất ngờ nữa.',
    todayNote: 'Ghi chú hôm nay',
    noteHelp: 'Viết ra cảm xúc giúp giảm 40% cường độ cơn thèm (theo nghiên cứu).',
    notePlaceholder: 'Hôm nay tôi cảm thấy... / Điều khó khăn nhất lúc này là...',
    saveNote: 'Lưu ghi chú',
    saving: 'Đang lưu...',
    noteSaved: 'Ghi chú đã được lưu ✓',
    noteEmpty: 'Hãy viết gì đó trước khi lưu',

    // Info boxes
    info1: 'Ghi chú cảm xúc mỗi ngày giúp não nhận diện tác nhân — nghiên cứu cho thấy viết ra giảm 40% cường độ cơn thèm.',
    info2: 'Cơn thèm như sóng biển — nó lên rồi tự xuống sau 15-20 phút nếu bạn không nuôi dưỡng nó.',
    info3: 'Mỗi lần vượt qua cơn thèm = tạo đường thần kinh mới. Làm đủ nhiều lần, con đường cũ tự mờ đi.',

    // Urge surf
    urgeTitle: 'Vượt sóng cơn thèm',
    urgeSubtitle: 'Cơn thèm như sóng — hãy quan sát nó, không phản ứng theo',
    urgeInstruction: 'Ngồi yên, hít thở, và quan sát cảm giác mà không hành động',
    urgeReplacement: 'Trong lúc chờ, thử một trong các cách này:',
    urgeOvercome: 'Tôi đã vượt qua rồi ✓',
    urgeRelapse: 'Ghi nhận là đã tái nghiện',
    breathe: 'thở',
    walkLabel: 'Đi bộ 5 phút',
    waterLabel: 'Uống một ly nước',
    musicLabel: 'Nghe nhạc yêu thích',
    callLabel: 'Gọi cho bạn bè',
    writeLabel: 'Viết ra cảm xúc',
    breatheLabel: 'Hít thở 4-7-8',
    overcameToast: 'Xuất sắc! Bạn đã vượt qua cơn thèm 💪',
    relapseToast: 'Đã ghi nhận. Tái nghiện là dữ liệu, không phải thất bại.',

    // Coach
    coachTitle: 'Trò chuyện AI',
    coachSubtitle: 'An toàn, riêng tư, không phán xét',
    coachWelcome: 'Xin chào. Mình ở đây để lắng nghe — không có sự phán xét nào cả. Bạn đang cảm thấy thế nào hôm nay?',
    coachPlaceholder: 'Chia sẻ với trợ lý của bạn...',
    send: 'Gửi',
    coachError: 'Không thể kết nối lúc này. Hãy thử lại sau.',
    you: 'Bạn',

    // Journal
    journalTitle: 'Nhật ký tác nhân',
    journalSubtitle: 'Ghi lại ngay khi có cơn thèm để nhận ra quy luật',
    whatTrigger: 'Tác nhân lúc này là gì?',
    intensity: 'Cường độ',
    journalNotePlaceholder: 'Bạn đang ở đâu, làm gì, cảm thấy gì ngay lúc này?',
    logTrigger: 'Ghi lại tác nhân này',
    triggerLogged: 'Tác nhân đã được ghi lại',

    // Trigger labels
    stress: 'Căng thẳng',
    boredom: 'Buồn chán',
    lonely: 'Cô đơn',
    tired: 'Mệt mỏi',
    conflict: 'Xung đột',
    socialPressure: 'Áp lực xã hội',
    afterEating: 'Sau bữa ăn',
    environment: 'Môi trường',
    other: 'Khác',

    // History
    historyTitle: 'Lịch sử',
    historySubtitle: 'Mỗi ghi nhận là dữ liệu giúp bạn hiểu bản thân hơn',
    noHistory: 'Chưa có ghi nhận nào. Hãy bắt đầu ghi lại nhật ký.',
    overcame: 'Đã vượt qua',
    relapse: 'Tái nghiện',
    logged: 'Đã ghi',

    // Milestones
    milestonesTitle: 'Cột mốc',
    milestonesSubtitle: 'Mỗi ngày sạch là một chiến thắng thật sự',
    daysMore: 'ngày nữa',
    achieved: 'Đã đạt',

    // Settings
    language: 'Ngôn ngữ',
    signOut: 'Đăng xuất',
  },

  en: {
    appName: 'Overcome',
    appTagline: 'AI Recovery Coach',

    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    signUp: 'Create Account',
    rememberMe: 'Remember me',
    noAccount: "Don't have an account? Sign up",
    hasAccount: 'Already have an account? Sign in',

    chooseLanguage: 'Choose Language',
    langVI: '🇻🇳 Tiếng Việt',
    langEN: '🇺🇸 English',
    langDesc: 'You can change this later in settings',

    navHome: 'Overview',
    navCoach: 'AI Chat',
    navJournal: 'Journal',
    navHistory: 'History',
    navMilestones: 'Milestones',

    streakDays: 'days clean',
    currentStreak: 'Current streak',
    bestRecord: 'Personal best',
    iHaveCraving: '⚡ I have a craving — help now',
    cravingSubtext: 'Tap to start the urge surfing technique',
    commonTriggers: 'Common Triggers',
    triggerHelp: 'Recognizing triggers helps your brain prepare — no more being caught off guard.',
    todayNote: "Today's Note",
    noteHelp: 'Writing out feelings reduces craving intensity by 40% (research-backed).',
    notePlaceholder: 'Today I feel... / The hardest thing right now is...',
    saveNote: 'Save Note',
    saving: 'Saving...',
    noteSaved: 'Note saved ✓',
    noteEmpty: 'Write something before saving',

    info1: 'Daily emotional journaling helps your brain identify trigger patterns — research shows writing reduces craving intensity by 40%.',
    info2: 'Cravings are like waves — they rise and fall within 15-20 minutes if you don\'t act on them.',
    info3: 'Every time you overcome a craving = a new neural pathway forms. Do it enough times, the old path fades.',

    urgeTitle: 'Urge Surfing',
    urgeSubtitle: 'Cravings are like waves — observe it, don\'t react to it',
    urgeInstruction: 'Sit still, breathe, and observe the feeling without acting on it',
    urgeReplacement: 'While waiting, try one of these:',
    urgeOvercome: 'I made it through ✓',
    urgeRelapse: 'Log as relapse',
    breathe: 'breathe',
    walkLabel: 'Walk 5 minutes',
    waterLabel: 'Drink a glass of water',
    musicLabel: 'Listen to favorite music',
    callLabel: 'Call a friend',
    writeLabel: 'Write out feelings',
    breatheLabel: '4-7-8 breathing',
    overcameToast: 'Amazing! You overcame the craving 💪',
    relapseToast: 'Noted. A relapse is data, not failure.',

    coachTitle: 'AI Coach',
    coachSubtitle: 'Safe, private, non-judgmental',
    coachWelcome: 'Hello. I\'m here to listen — no judgment whatsoever. How are you feeling today?',
    coachPlaceholder: 'Share with your coach...',
    send: 'Send',
    coachError: 'Cannot connect right now. Please try again.',
    you: 'You',

    journalTitle: 'Trigger Journal',
    journalSubtitle: 'Log immediately when you have a craving to find patterns',
    whatTrigger: 'What is triggering you right now?',
    intensity: 'Intensity',
    journalNotePlaceholder: 'Where are you, what are you doing, what do you feel right now?',
    logTrigger: 'Log this trigger',
    triggerLogged: 'Trigger logged',

    stress: 'Stress',
    boredom: 'Boredom',
    lonely: 'Loneliness',
    tired: 'Fatigue',
    conflict: 'Conflict',
    socialPressure: 'Social pressure',
    afterEating: 'After eating',
    environment: 'Environment',
    other: 'Other',

    historyTitle: 'History',
    historySubtitle: 'Every entry is data that helps you understand yourself better',
    noHistory: 'No entries yet. Start logging your triggers.',
    overcame: 'Overcame',
    relapse: 'Relapse',
    logged: 'Logged',

    milestonesTitle: 'Milestones',
    milestonesSubtitle: 'Every clean day is a real victory',
    daysMore: 'days to go',
    achieved: 'Achieved',

    language: 'Language',
    signOut: 'Sign Out',
  }
}

export type Strings = typeof strings['vi']
