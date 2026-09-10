export const formatDate = (dateString, current = false) => {
  if (current) return 'Present';
  if (!dateString) return '';

  try {
    const parts = dateString.split('-');
    if (parts.length >= 2) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const date = new Date(year, month);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return dateString;
  } catch {
    return dateString;
  }
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

export const ensureUrl = (url) => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

export const formatCleanUrl = (url) => {
  if (!url) return '';
  return String(url)
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '');
};

export const parseBulletPoints = (text) => {
  if (!text) return [];
  if (Array.isArray(text)) return text.filter(Boolean);
  return String(text)
    .split('\n')
    .map((line) => line.replace(/^[\s•\-\*–—\d\.\)]+/, '').trim())
    .filter((line) => line.length > 0);
};

export const groupSkills = (skills) => {
  if (!skills || !Array.isArray(skills) || skills.length === 0) return [];
  const map = {};
  skills.forEach((s) => {
    const name = typeof s === 'string' ? s : s?.name;
    if (!name) return;
    const cat = (typeof s === 'object' && s?.category ? s.category.trim() : '') || 'Technical Skills';
    if (!map[cat]) map[cat] = [];
    map[cat].push(name);
  });
  return Object.entries(map);
};




