// Typing speed maths: words per minute (5 letters = 1 word), accuracy, and which letters are right so far.
export function typingStats(target, typed, seconds) {
  let correct = 0;
  for (let i = 0; i < typed.length; i += 1) if (typed[i] === target[i]) correct += 1;
  const minutes = Math.max(seconds, 1) / 60;
  return {
    wpm: Math.round(correct / 5 / minutes),
    accuracy: typed.length ? Math.round((correct / typed.length) * 100) : 100,
    correct,
    typed: typed.length,
  };
}

// For each letter of the passage: 'ok', 'bad' or 'todo'.
export const letterStates = (target, typed) => [...target].map((ch, i) => (i >= typed.length ? 'todo' : typed[i] === ch ? 'ok' : 'bad'));
