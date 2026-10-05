import { notFound } from "next/navigation";

/* Fängt jede Adresse unterhalb einer Sprache ab, die keine Seite hat,
   damit die 404 im Sprach-Layout (Kopf, Fuß, Übersetzung) erscheint
   statt in Nexts ungestalteter Standardseite. */
export default function CatchAll() {
  notFound();
}
