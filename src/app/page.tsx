import { CalendarBody } from "@/components/calendar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Home() {
  const blocks = [
    {
      title: "Projekttyp",
      content: "Online-Terminplaner mit Administrator- und Benutzeransicht",
    },
    {
      title: "Frontend-Framework",
      content: "React (mit Next.js)",
    },
    {
      title: "Datenbank",
      content: "Mongodb",
    },
    {
      title: "Styling",
      content: "Tailwind CSS und Shadcn",
    },
    {
      title: "Hosting",
      content: (
        <a
          href="https://next-presentation-five.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Gehostet über Vercel
        </a>
      ),
    },
    {
      title: "Versionsverwaltung",
      content: (
        <a
          href="https://github.com/JusSchw/next-presentation"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Quellcode auf GitHub
        </a>
      ),
    },
  ];

  const plannedFeatures = [
    "Verhinderung von Terminüberschneidungen",
    "Tagesstrukturierte Terminanzeige",
    "Benachrichtigung per E-Mail bei Terminbestätigung",
    "Visuelles Ladefeedback bei Operationen",
    "Visuelle Bestätigung bei erfolgreicher Aktion",
    "Nicht verfügbare Zeiträume definieren",
    "Responsive Design für Mobilgeräte",
  ];

  return (
    <main className="mx-auto w-[800px]">
      <h1 className="py-8 text-4xl text-center">Justins Beispielprojekt</h1>
      <Separator />
      <section className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-8 text-sm">
        {blocks.map((block, idx) => (
          <Card key={idx} className="h-full">
            <CardHeader className="font-semibold text-muted-foreground text-base">
              {block.title}
            </CardHeader>
            <CardContent>{block.content}</CardContent>
          </Card>
        ))}
      </section>
      <Separator />
      <h2 className="py-8 text-4xl text-center">Online-Terminplaner</h2>
      <CalendarBody />
      <section className="py-8">
        <h3 className="mb-8 font-semibold text-muted-foreground text-3xl text-center">
          Geplante Erweiterungen
        </h3>
        <ul className="space-y-2 list-disc list-inside">
          {plannedFeatures.map((feature, idx) => (
            <li key={idx} className="text-muted-foreground">
              {feature}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
