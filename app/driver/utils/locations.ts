/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
export interface Location {
  getCurrentPosition(): void;
}

export class GPSLocation implements Location {
  getCurrentPosition(): void {
    throw new Error("Not Implemented")
  }
}

export class FakeLocation implements Location {
  getCurrentPosition(): void {
    throw new Error("Method not implemented.");
  }
}

export default { Location, GPSLocation, FakeLocation };
