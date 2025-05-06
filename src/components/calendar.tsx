"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSession } from "@/lib/client/session";
import { useEffect, useState } from "react";
import { useCalendar } from "@/lib/client/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

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
            <FullCalendar onlyFuture={true} isUser={true} />
          </TabsContent>
          <TabsContent value="admin">
            {session ? <FullCalendar /> : <PasswordPrompt />}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

function FullCalendar({
  onlyFuture = false,
  isUser = false,
}: {
  onlyFuture?: boolean;
  isUser?: boolean;
}) {
  const {
    currentDate,
    selectedDate,
    selectDate,
    prevMonth,
    prevYear,
    nextMonth,
    nextYear,
  } = useCalendar();

  const daysInMonth = currentDate.daysInMonth();

  const weeks = [];
  let dayCounter = 1 - currentDate.startOf("month").day();

  for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
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
    <section className="flex gap-4 w-[729px] h-[525px]">
      <div>
        <div className="flex justify-center w-full">
          <div className="flex justify-center items-center">
            <Button
              disabled={onlyFuture && currentDate < dayjs()}
              variant="ghost"
              size="sm"
              onClick={prevMonth}
              className="px-2"
            >
              &lt;
            </Button>
            <span className="w-24 text-center capitalize">
              {currentDate.format("MMMM")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextMonth}
              className="px-2"
            >
              &gt;
            </Button>
          </div>
          <div className="flex justify-center items-center">
            <Button
              disabled={onlyFuture && currentDate < dayjs()}
              variant="ghost"
              size="sm"
              onClick={prevYear}
              className="px-2"
            >
              &lt;
            </Button>
            <span className="w-24 text-center capitalize">
              {currentDate.year()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextYear}
              className="px-2"
            >
              &gt;
            </Button>
          </div>
        </div>
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
                if (
                  !cell ||
                  (onlyFuture && cell.fullDate < new Date().getTime())
                )
                  return <div key={j} className="size-16" />;

                return (
                  <div
                    onClick={() => selectDate(cell.fullDate)}
                    className={cn(
                      "flex justify-center items-center bg-background rounded-md size-16 hover:scale-110 transition-transform cursor-default",
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
      </div>
      <Separator orientation="vertical" />
      <div>{isUser ? <AppointmentPrompt /> : <></>}</div>
    </section>
  );
}

function AppointmentPrompt() {
  const { selectedDate, requestAppointment } = useCalendar();

  const [appointment, setAppointment] = useState({
    from: "",
    until: "",
    descr: "",
    title: "",
  });

  const disable =
    !selectedDate || appointment.from === "" || appointment.until === "";

  const handleSubmit = () => {
    if (disable) return;

    const fromDateTime = dayjs(selectedDate)
      .hour(Number(appointment.from.split(":")[0]))
      .minute(Number(appointment.from.split(":")[1]));

    const untilDateTime = dayjs(selectedDate)
      .hour(Number(appointment.until.split(":")[0]))
      .minute(Number(appointment.until.split(":")[1]));

    const fromMillis = fromDateTime.valueOf();
    const untilMillis = untilDateTime.valueOf();

    requestAppointment({
      from: fromMillis,
      until: untilMillis,
      descr: appointment.descr,
      title: appointment.title,
    });

    setAppointment({
      from: "",
      until: "",
      descr: "",
      title: "",
    });
  };

  return (
    <div className="flex flex-col justify-end gap-2 h-full">
      <div className="flex gap-2">
        <Input
          disabled={!selectedDate}
          type="time"
          value={appointment.from}
          className="w-24"
          onChange={(e) =>
            setAppointment({
              ...appointment,
              from: e.target.value,
            })
          }
        />
        <Input
          disabled={!selectedDate}
          type="time"
          value={appointment.until}
          className="w-24"
          onChange={(e) =>
            setAppointment({
              ...appointment,
              until: e.target.value,
            })
          }
        />
      </div>
      <Input
        disabled={!selectedDate}
        placeholder="Titel"
        value={appointment.title}
        onChange={(e) =>
          setAppointment({
            ...appointment,
            title: e.target.value,
          })
        }
      />
      <Textarea
        disabled={!selectedDate}
        placeholder="Beschreibung"
        className="flex-grow resize-none"
        value={appointment.descr}
        onChange={(e) =>
          setAppointment({
            ...appointment,
            descr: e.target.value,
          })
        }
      />
      <Button disabled={disable} onClick={handleSubmit}>
        Senden
      </Button>
    </div>
  );
}
function PasswordPrompt() {
  const { newSession } = useSession();
  return (
    <form
      action={async (data: FormData) => {
        newSession(data.get("password")?.toString());
      }}
    >
      <div className="flex justify-center items-center gap-2 w-[729px] h-[525px]">
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
