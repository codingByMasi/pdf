// Runs a regular expression on a text and lists the matches with their places and groups. At most `limit` matches.
export function runRegex(pattern, flags, text, limit = 200) {
  let re;
  try {
    re = new RegExp(pattern, flags.includes('g') ? flags : `${flags}g`);
  } catch (error) {
    return { ok: false, message: String(error.message).replace(/^Invalid regular expression: /, '') };
  }
  const matches = [];
  let m;
  while ((m = re.exec(text)) !== null && matches.length < limit) {
    matches.push({ index: m.index, text: m[0], groups: m.slice(1).map((g) => g ?? null), named: m.groups ? { ...m.groups } : null });
    if (m[0] === '') re.lastIndex += 1;
  }
  return { ok: true, matches, more: m !== null };
}
