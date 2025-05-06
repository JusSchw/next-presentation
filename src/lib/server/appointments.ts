"use server";

import { Appointment } from "@/types";
import { db } from "../mongo";
import { ObjectId } from "mongodb";
import { readSession } from "./session";
import { isAppointmentInDay } from "../utils";
import dayjs from "dayjs";

// USER ACTIONS

export async function requestAppointment(apo: Appointment): Promise<boolean> {
  if (!isAppointmentInDay(apo)) {
    return false;
  }

  await db.collection("requested").insertOne(apo);
  return true;
}

// ADMIN ACTIONS

export async function getAppointments(
  type: "scheduled" | "requested" = "scheduled"
): Promise<(Appointment & { _id: string })[]> {
  if (!(await readSession())) {
    return [];
  }

  const appointments = await db
    .collection<Appointment>(type)
    .find({})
    .toArray();

  return appointments.map((apo) => ({
    ...apo,
    _id: apo._id.toHexString(),
  }));
}

export async function acceptAppointment(_id: string): Promise<boolean> {
  if (!(await readSession())) {
    return false;
  }

  const apo = await db
    .collection("requested")
    .findOne({ _id: new ObjectId(_id) });

  if (apo) {
    await db.collection("scheduled").insertOne(apo);
    await db.collection("requested").deleteOne({ _id: new ObjectId(_id) });

    return true;
  }
  return false;
}

export async function deleteAppointment(
  _id: string,
  type: "scheduled" | "requested" = "scheduled"
): Promise<boolean> {
  if (!(await readSession())) {
    return false;
  }

  await db.collection(type).deleteOne({ _id: new ObjectId(_id) });
  return true;
}
