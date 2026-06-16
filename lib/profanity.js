// Danh sách từ bị chặn — tiếng Việt và tiếng Anh
// Gồm cả dạng có dấu đầy đủ và các viết tắt phổ biến
const BLOCKLIST = [
  // ── Tiếng Việt (có dấu) ──────────────────────────────────
  'đụ', 'đụ má', 'đụ mẹ', 'đụ cha',
  'đéo', 'đéo mẹ',
  'đít',
  'lồn',
  'cặc',
  'buồi',
  'đĩ', 'điếm', 'cave',
  'vãi lồn', 'vãi đái',
  'mẹ kiếp',
  'khốn nạn',
  'súc vật',
  'đồ chó', 'chó chết', 'con chó',
  // ── Viết tắt phổ biến (không dấu) ───────────────────────
  'đmm', 'dmm', 'đm', 'dm',
  'đcm', 'dcm',
  'vcl', 'vkl',
  'clm', 'cl',
  'cc', 'ccc',
  'dm', 'lol', // lol nếu dùng mang tính chất nhạo báng
  // ── Tiếng Anh ────────────────────────────────────────────
  'fuck', 'fucker', 'fucking', 'motherfucker',
  'shit', 'bullshit',
  'asshole', 'bitch',
  'bastard', 'cunt',
  'dick', 'cock',
  'whore', 'slut',
  'nigga', 'nigger',
]

// Chuẩn hoá: lowercase + xoá ký tự phân cách phổ biến dùng để né tránh
// Ví dụ: "đ.ụ" → "đụ", "đ*m" → "đm", "đ m" → "đm"
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[.\-_*|/\\@#!?\s]+/g, '')
}

export function containsProfanity(text) {
  if (!text) return false
  const norm = normalize(text)
  return BLOCKLIST.some(word => norm.includes(normalize(word)))
}
