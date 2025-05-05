import { create } from "zustand";
import { newSession, readSession } from "../server/session";

type useSessionState = {
  session: boolean;
  newSession: (password?: string) => void;
  readSession: () => void;
};

export const useSession = create<useSessionState>((set) => ({
  session: false,
  newSession: (password?: string) => {
    newSession(password).then((session) =>
      set((state) => ({ ...state, session }))
    );
  },
  readSession: () => {
    readSession().then((session) => set((state) => ({ ...state, session })));
  },
}));
