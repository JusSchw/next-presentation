import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "./ui/separator";
import { use } from "react";
import { newSession, readSession } from "@/lib/server/session";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function CalendarBody() {
  const session = use(readSession());

  return (
    <Card className="m-4 w-4xl">
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
  return <>CalendarUser</>;
}

export function CalendarAdmin() {
  return <>CalendarAdmin</>;
}

export function PasswordPrompt() {
  return (
    <form
      action={async (data: FormData) => {
        "use server";
        await newSession(data.get("password")?.toString());
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
