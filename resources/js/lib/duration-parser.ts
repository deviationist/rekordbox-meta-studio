export interface IDurationParts {
  d: number | null;
  h: number | null;
  m: number | null;
  s: number | null;
};

export class DurationParser {
  private format: 'timeCode' | 'abbreviated';
  private durationParts: IDurationParts;
  private durationString: string;
  private timeFormatRegex = /^\d{1,2}:\d{2}(:\d{2})?$/;
  private abbreviatedDurationRegex = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;

  private constructor(durationString: string) {
    this.durationString = this.cleanString(durationString);
    this.format = this.resolveFormat();
    this.durationParts = { d: null, h: null, m: null, s: null };
  }

  private resolveFormat() {
    return this.durationString.match(/^\d{1,2}:[0-5]\d(:[0-5]\d)?$/) ? 'timeCode' : 'abbreviated';
  }

  public parse() {
    if (this.durationString.match(/^\d{1,2}:[0-5]\d(:[0-5]\d)?$/)) {
      return this.parseTimeCodeDuration();
    } else {
      return this.parseAbbreviatedDuration();
    }
  }

  static parseString(durationString: string): DurationParser {
    const instance = new DurationParser(durationString);
    instance.parse();
    return instance;
  }

  static normalizeString(durationString: string): string {
    const instance = new DurationParser(durationString);
    instance.parse();
    switch (instance.format) {
      case 'abbreviated':
        return instance.toAbbreviated();
      case 'timeCode':
        return instance.toTimeCode();
    }
  }

  private cleanString(durationString: string): string {
    return durationString.replace(/\s+/g, '');
  }

  private setResult(a: IDurationParts) {
    this.durationParts = this.normalizeDurationParts(a);
  }

  public getResult(): IDurationParts {
    return this.durationParts;
  }

  public toSeconds(): number {
    return (
      (this.durationParts.d ?? 0) * 86400 +
      (this.durationParts.h ?? 0) * 3600 +
      (this.durationParts.m ?? 0) * 60 +
      (this.durationParts.s ?? 0)
    );
  }

  public toAbbreviated(): string {
    const components = [
      this.durationParts.d && `${this.durationParts.d}d`,
      this.durationParts.h && `${this.durationParts.h}h`,
      this.durationParts.m && `${this.durationParts.m}m`,
      this.durationParts.s && `${this.durationParts.s}s`,
    ].filter(Boolean);
    return components.join('') || '0s';
  }

  public toTimeCode(): string {
    const totalSeconds = this.toSeconds();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // If duration is less than an hour, use mm:ss format
    if (hours === 0) {
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Otherwise use hh:mm:ss format
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  private normalizeDurationParts ({ d: days, h: hours, m: minutes, s: seconds}: IDurationParts): IDurationParts {
    if (seconds && seconds > 59) {
      const additionalMinutes = Math.ceil((seconds - 60) / 60);
      seconds -= (additionalMinutes * 60)
      minutes = (minutes ?? 0) + additionalMinutes;
    }
    if (minutes && minutes > 59) {
      const additionalHours = Math.ceil((minutes - 60) / 60);
      minutes -= (additionalHours * 60)
      hours = (hours ?? 0) + additionalHours;
    }
    if (hours && hours > 23) {
      const additionalDays = Math.ceil((hours - 24) / 24);
      hours -= (additionalDays * 24)
      days = (days ?? 0) + additionalDays;
    }

    return {
      'd': days,
      'h': hours,
      'm': minutes,
      's': seconds,
    };
  }

  private parseTimeCodeDuration() {
    if (this.timeFormatRegex.test(this.durationString)) {
      // Parse as HH:MM:SS or MM:SS
      const parts = this.durationString.split(':').map(p => parseInt(p, 10));

      if (parts.length === 2) {
        const [minutes, seconds] = parts;
        this.setResult({
          d: null,
          h: null,
          m: minutes,
          s: seconds,
        });
      } else if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;
        this.setResult({
          d: null,
          h: hours,
          m: minutes,
          s: seconds,
        });
      }
      return this.getResult();
    }

    return null;
  }

  private parseAbbreviatedDuration(): IDurationParts | null {
    // TParse abbreviated format, like 3m37s 3d59m3s 4h12m 5h32m56s
    const match = this.durationString.match(this.abbreviatedDurationRegex);

    if (!match) return null;

    // Check that at least one unit was specified
    if (!match[1] && !match[2] && !match[3] && !match[4]) {
      return null;
    }

    const days = match[1] ? parseInt(match[1] || '0', 10) : null;
    const hours = match[2] ? parseInt(match[2] || '0', 10) : null;
    const minutes = match[3] ? parseInt(match[3] || '0', 10) : null;
    const seconds = match[4] ? parseInt(match[4] || '0', 10) : null;

    this.setResult({
      'd': days,
      'h': hours,
      'm': minutes,
      's': seconds,
    });
    return this.getResult();
  }
}
