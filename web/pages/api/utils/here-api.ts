import Axios from "axios";
import { mapDataToPolylinesAndDuration } from "./convert";
import { HereApiKey } from "./config";

export async function routing(origin: string, destination: string, via: string[] = []) {
  return mapDataToPolylinesAndDuration(
    await Axios.get(
      `https://router.hereapi.com/v8/routes?transportMode=car&origin=${origin}${via
        ?.map((latLng) => `&via=${latLng}`)
        .join(
          ""
        )}&destination=${destination}&return=polyline,summary&apiKey=${HereApiKey}`
    )
  );
}

export default { routing };
