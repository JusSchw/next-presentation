import { Appointment } from "@/types";
import { clsx, type ClassValue } from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAppointmentsInDay(
  appointments: Appointment[],
  day: Dayjs
): number[] {
  const dayStart = day.startOf("day").valueOf();
  const dayEnd = day.endOf("day").valueOf();

  return appointments.reduce<number[]>((acc, apo, index) => {
    const overlaps =
      (apo.from >= dayStart && apo.from <= dayEnd) ||
      (apo.until >= dayStart && apo.until <= dayEnd) ||
      (apo.from <= dayStart && apo.until >= dayEnd);

    if (overlaps) acc.push(index);
    return acc;
  }, []);
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
