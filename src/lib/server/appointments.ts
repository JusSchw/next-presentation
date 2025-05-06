"use server";

import { Appointment } from "@/types";
import { db } from "../mongo";
import { ObjectId } from "mongodb";
import { readSession } from "./session";
import { isAppointmentInDay } from "../utils";
import dayjs from "dayjs";

// USER ACTIONS

export async function requestAppointment(appo: Appointment): Promise<boolean> {
  if (!isAppointmentInDay(appo)) {
    return false;
  }

  await db.collection("requested").insertOne(appo);
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

  return appointments.map((appo) => ({
    ...appo,
    _id: appo._id.toHexString(),
  }));
}

export async function acceptAppointment(_id: string): Promise<boolean> {
  if (!(await readSession())) {
    return false;
  }

  const appo = await db
    .collection("requested")
    .findOne({ _id: new ObjectId(_id) });

  if (appo) {
    await db.collection("scheduled").insertOne(appo);
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
