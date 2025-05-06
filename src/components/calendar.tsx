"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSession } from "@/lib/client/session";
import { useEffect, useState } from "react";
import { useCalendar } from "@/lib/client/calendar";
import { cn } from "@/lib/utils";

export function CalendarBody() {
  const { session, readSession } = useSession();

  useEffect(() => {
    readSession();
  }, [readSession]);

  return (
    <Card className="m-4">
      <Tabs defaultValue="user" className="w-full">
        <CardHeader>
          <TabsList className="w-full">
            <TabsTrigger value="user">Benutzer Kalender</TabsTrigger>
            <TabsTrigger value="admin">Admin Kalender</TabsTrigger>
          </TabsList>
        </CardHeader>
        <Separator className="my-4" />
        <CardContent>
          <TabsContent value="user">
            <CalendarUser />
          </TabsContent>
          <TabsContent value="admin">
            {session ? <CalendarAdmin /> : <PasswordPrompt />}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

export function CalendarUser() {
  return (
    <>
      <FullCalendar onlyFuture={true} />
    </>
  );
}

export function CalendarAdmin() {
  return (
    <>
      <FullCalendar />
    </>
  );
}

export function FullCalendar({ onlyFuture = false }: { onlyFuture?: boolean }) {
  const { currentDate, selectedDate, selectDate } = useCalendar();

  const daysInMonth = currentDate.daysInMonth();

  const weeks = [];
  let dayCounter = 1 - currentDate.startOf("month").day();

  while (dayCounter <= daysInMonth) {
    const week = Array(7)
      .fill(0)
      .map((_) => {
        const day = dayCounter++;
        if (day > 0 && day <= daysInMonth) {
          const fullDate = currentDate.date(day).toDate().getTime();
          return { day, fullDate };
        }
        return null;
      });
    weeks.push(week);
  }

  return (
    <section>
      <div className="flex gap-2 font-medium text-sm text-center">
        {["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"].map((d) => (
          <div className="my-4 w-16 text-center" key={d}>
            {d}
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex flex-col gap-2 pt-4">
        {weeks.map((week, i) => (
          <div key={i} className="flex gap-2">
            {week.map((cell, j) => {
              if (!cell) return <div key={j} className="size-16" />;

              return (
                <div
                  onClick={() => selectDate(cell.fullDate)}
                  className={cn(
                    "flex justify-center items-center bg-background rounded-md size-16 hover:scale-110 transition-transform hover:cursor-default",
                    selectedDate == cell.fullDate && "bg-accent"
                  )}
                  key={cell.fullDate}
                >
                  <p className="text-center">{cell.day}</p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

export function PasswordPrompt() {
  const { newSession } = useSession();
  return (
    <form
      action={async (data: FormData) => {
        newSession(data.get("password")?.toString());
      }}
    >
      <div className="flex justify-center gap-2 w-full">
        <Input
          name="password"
          type="password"
          id="password"
          placeholder="Passwort"
          className="w-72"
        />
        <Button type="submit">Bestätigen</Button>
      </div>
    </form>
  );
}
