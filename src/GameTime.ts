export class GameTime {
  public gameTimeHour: number;
  public gameTimeMinute: number;
  public gameTimeSecond: number;
  public timescale: number;

  constructor(
    hour?: number,
    minute?: number,
    second?: number,
    timescale?: number
  ) {
    this.gameTimeHour = hour | 12;
    this.gameTimeMinute = minute | 0;
    this.gameTimeSecond = second | 0;
    this.timescale = timescale | 5;
  }

  update(timeElapsed: number) {
    this.gameTimeSecond += timeElapsed * this.timescale;

    if (this.gameTimeSecond > 59) {
      this.gameTimeSecond = 0;
      this.gameTimeMinute++;
    }

    if (this.gameTimeMinute > 59) {
      this.gameTimeMinute = 0;
      this.gameTimeHour++;
    }

    if (this.gameTimeHour > 23) {
      this.gameTimeMinute = 0;
    }
  }

  timeToSeconds(): number {
    return (
      this.gameTimeHour * 60 * 60 +
      this.gameTimeMinute * 60 +
      this.gameTimeSecond
    );
  }
}
