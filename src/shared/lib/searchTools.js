// Filters tools by the words a person typed, looking in the tool's name and description.
export function searchTools(list, query, textOf) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return list;
  return list.filter((tool) => {
    const haystack = textOf(tool).toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
}
