export const FileTypes = {
  MP3: 'MP3',
  AIFF: 'AIFF',
  WAV: 'WAV',
  Unknown: 'Unknown',
} as const;

export type FileType = typeof FileTypes[keyof typeof FileTypes];
