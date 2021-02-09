// eslint-disable-next-line max-classes-per-file
export interface Location {
  getCurrentPosition();
}

export class GPSLocation implements Location {
  
}

export class FakeLocation implements Location {

}

export default { Location, GPSLocation, FakeLocation };
