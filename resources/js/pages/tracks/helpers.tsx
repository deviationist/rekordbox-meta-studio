// Format file size
export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '-';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

// Key color mapping (Camelot wheel)
export const getKeyColor = (key?: string): string => {
  if (!key) return 'default';

  // Normalize the key string
  const normalizedKey = key.trim();

  // If it's already in Camelot notation, use direct lookup
  const majorKeys = ['8B', '3B', '10B', '5B', '12B', '7B', '2B', '9B', '4B', '11B', '6B', '1B'];
  const minorKeys = ['5A', '12A', '7A', '2A', '9A', '4A', '11A', '6A', '1A', '8A', '3A', '10A'];

  if (majorKeys.includes(normalizedKey)) return 'blue';
  if (minorKeys.includes(normalizedKey)) return 'purple';

  // Convert standard notation to Camelot
  const keyToCamelot: Record<string, string> = {
    // Major keys (B)
    'C maj': '8B', 'C': '8B',
    'D♭ maj': '3B', 'Db maj': '3B', 'C# maj': '3B', 'Db': '3B', 'C#': '3B',
    'D maj': '10B', 'D': '10B',
    'E♭ maj': '5B', 'Eb maj': '5B', 'D# maj': '5B', 'Eb': '5B', 'D#': '5B',
    'E maj': '12B', 'E': '12B',
    'F maj': '7B', 'F': '7B',
    'F# maj': '2B', 'F#': '2B', 'G♭ maj': '2B', 'Gb maj': '2B', 'Gb': '2B',
    'G maj': '9B', 'G': '9B',
    'A♭ maj': '4B', 'Ab maj': '4B', 'G# maj': '4B', 'Ab': '4B', 'G#': '4B',
    'A maj': '11B', 'A': '11B',
    'B♭ maj': '6B', 'Bb maj': '6B', 'A# maj': '6B', 'Bb': '6B', 'A#': '6B',
    'B maj': '1B', 'B': '1B',

    // Minor keys (A)
    'A min': '5A', 'Am': '5A',
    'B♭ min': '12A', 'Bbm': '12A', 'A#m': '12A', 'Bb min': '12A', 'A# min': '12A',
    'B min': '7A', 'Bm': '7A',
    'C min': '2A', 'Cm': '2A',
    'C# min': '9A', 'C#m': '9A', 'D♭m': '9A', 'Dbm': '9A', 'Db min': '9A',
    'D min': '4A', 'Dm': '4A',
    'E♭ min': '11A', 'Ebm': '11A', 'D#m': '11A', 'Eb min': '11A', 'D# min': '11A',
    'E min': '6A', 'Em': '6A',
    'F min': '1A', 'Fm': '1A',
    'F# min': '8A', 'F#m': '8A', 'G♭m': '8A', 'Gbm': '8A', 'Gb min': '8A',
    'G min': '3A', 'Gm': '3A',
    'A♭ min': '10A', 'Abm': '10A', 'G#m': '10A', 'Ab min': '10A', 'G# min': '10A',
  };

  const camelotKey = keyToCamelot[normalizedKey];

  if (camelotKey) {
    return camelotKey.endsWith('B') ? 'blue' : 'purple';
  }

  return 'default';
};
