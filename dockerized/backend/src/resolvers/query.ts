import { UserWhereUniqueInput } from "@prisma/client";
import Axios from "axios";
import fs from "fs";
import path from "path";
import { Context } from "../utils/types";

export async function users(
  _parent: any,
  { search }: { search: string },
  { auth, prisma }: Context,
) {
  return prisma.user.findMany({
    where: {
      username: { contains: search, mode: "insensitive" },
      userId: { not: auth.userId },
      followers: {
        none: {
          followerId: auth.userId,
        },
      },
    },
  });
}

export async function user(
  _parent: any,
  { userId }: UserWhereUniqueInput,
  { prisma }: Context,
) {
  return prisma.user.findOne({ where: { userId } });
}

export async function me(
  _parent: any,
  _args: any,
  { auth, prisma, response }: Context,
) {
  if (!auth?.userId) {
    response.status(401);
    throw new Error("Unathorized");
  }

  return prisma.user.findOne({
    where: { userId: auth.userId },
    include: {
      receiveOrders: true,
      sendOrders: true,
      deliverOrders: true,
      followees: {
        include: { followee: true },
      },
      followers: {
        include: { follower: true },
      },
    },
  });
}

export async function addresses(
  _parent: any,
  { userId: customerId }: { userId: number },
  { prisma }: Context,
) {
  return prisma.address.findMany(
    { where: { customerId }, include: { User: true } },
  );
}

export async function districts() {
  const districtsData = JSON.parse(fs.readFileSync(
    path.join(__dirname, "../../data/districts.json"),
    "utf-8",
  ));

  return districtsData.features.map(({ properties }: any) => ({
    districtId: properties?.["地區號碼"],
    name: properties?.["地區"],
  }));
}

export async function coordinates(
  _parent: any,
  { query, county }: { query: string; county: string },
) {
  const results = (await Axios.get(
    encodeURI(
      `https://nominatim.openstreetmap.org/search/${query}, ${county}, 香港?format=json&addressdetails=1&limit=1`,
    ),
  )).data.map(({ lat, lon }: { lat: number; lon: number }) => ({
    latitude: lat,
    longitude: lon,
  }))[0];

  console.log(results);

  return results;
}

export default { users, user, me, addresses, districts, coordinates };
