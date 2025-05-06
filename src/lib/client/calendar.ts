import { create } from "zustand";
import dayjs from "dayjs";
import { Appointment } from "@/types";
import {
  acceptAppointment,
  deleteAppointment,
  getAppointments,
  requestAppointment,
} from "../server/appointments";

type useCalendarState = {
  currentDate: dayjs.Dayjs;
  selectedDate?: number;
  adminAppointments?: {
    scheduled: (Appointment & { _id: string })[];
    requested: (Appointment & { _id: string })[];
  };

  requestAppointment: (apo: Appointment) => void;

  getAppointments: () => void;
  acceptAppointment: (_id: string) => void;
  deleteAppointment: (_id: string, type: "scheduled" | "requested") => void;

  selectDate: (millis: number) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  prevYear: () => void;
  nextYear: () => void;
};

export const useCalendar = create<useCalendarState>((set) => ({
  currentDate: dayjs(),
  selectedDate: undefined,
  hiddenAppointments: [],

  requestAppointment: (apo: Appointment) => {
    requestAppointment(apo).then((result) => {
      set((state) => {
        if (result) {
          state.getAppointments();
        }
        return state;
      });
    });
  },

  getAppointments: () => {
    Promise.all([
      getAppointments("scheduled"),
      getAppointments("requested"),
    ]).then(([scheduled, requested]) => {
      set((state) => ({
        ...state,
        adminAppointments: {
          requested,
          scheduled,
        },
      }));
    });
  },

  acceptAppointment: (_id: string) => {
    acceptAppointment(_id).then((result) => {
      set((state) => {
        if (result) {
          state.getAppointments();
        }
        return state;
      });
    });
  },

  deleteAppointment: (
    _id: string,
    type: "scheduled" | "requested" = "scheduled"
  ) => {
    deleteAppointment(_id, type).then((result) => {
      set((state) => {
        if (result) {
          state.getAppointments();
        }
        return state;
      });
    });
  },

  selectDate: (millis: number) =>
    set((state) => ({
      ...state,
      selectedDate: millis,
    })),
  prevMonth: () =>
    set((state) => ({
      ...state,
      currentDate: state.currentDate.subtract(1, "month"),
    })),
  nextMonth: () =>
    set((state) => ({
      ...state,
      currentDate: state.currentDate.add(1, "month"),
    })),
  prevYear: () =>
    set((state) => ({
      ...state,
      currentDate: state.currentDate.subtract(1, "year"),
    })),
  nextYear: () =>
    set((state) => ({
      ...state,
      currentDate: state.currentDate.add(1, "year"),
    })),
}));
