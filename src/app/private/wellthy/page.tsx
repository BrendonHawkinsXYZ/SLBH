import type { Metadata } from "next";
import { isAuthenticated } from "./auth";
import { Gate } from "./Gate";
import { Prototype } from "./Prototype";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Private working session · Studio Lab BH", description: "A private working prototype.", robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } } };
export default async function WellthyPage() { return await isAuthenticated() ? <Prototype /> : <Gate />; }
