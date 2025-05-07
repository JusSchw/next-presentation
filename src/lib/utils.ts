import { Appointment } from "@/types";
import { clsx, type ClassValue } from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAppointmentsInDay(
  appointments: (Appointment & { _id: string })[],
  day: Dayjs
): (Appointment & { _id: string })[] {
  const dayStart = day.startOf("day").valueOf();
  const dayEnd = day.endOf("day").valueOf();

  return appointments
    .filter((appo) => {
      const overlaps =
        (appo.from >= dayStart && appo.from <= dayEnd) ||
        (appo.until >= dayStart && appo.until <= dayEnd) ||
        (appo.from <= dayStart && appo.until >= dayEnd);
      return overlaps;
    })
    .sort((a, b) => a.from - b.from);
}

export function sortAppointmentsPerDay(
  appointments: (Appointment & { _id: string })[]
): (Appointment & { _id: string })[] {
  return appointments.sort((a, b) => a.from - b.from);
}

export function isAppointmentInDay(
  appointment: Appointment,
  day?: Dayjs
): boolean {
  const fromDay = dayjs(new Date(appointment.from));
  const toDay = dayjs(new Date(appointment.until));

  const dayStart = (day || fromDay).startOf("day").valueOf();
  const dayEnd = (day || toDay).endOf("day").valueOf();

  return (
    fromDay <= toDay &&
    ((appointment.from >= dayStart && appointment.from <= dayEnd) ||
      (appointment.until >= dayStart && appointment.until <= dayEnd) ||
      (appointment.from <= dayStart && appointment.until >= dayEnd))
  );
}
