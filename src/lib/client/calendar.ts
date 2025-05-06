import { create } from "zustand";
import dayjs from "dayjs";

type useCalendarState = {
  currentDate: dayjs.Dayjs;
  selectedDate?: number;

  selectDate: (millis: number) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  prevYear: () => void;
  nextYear: () => void;
};

export const useCalendar = create<useCalendarState>((set) => ({
  currentDate: dayjs(),
  selectedDate: undefined,

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
