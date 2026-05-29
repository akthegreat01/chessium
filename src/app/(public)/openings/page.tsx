import React from "react";
import { Metadata } from "next";
import OpeningsClient from "./ClientPage";

export const metadata: Metadata = {
  title: "Opening Explorer | Chessium",
  description: "Explore and learn chess openings with interactive boards.",
  openGraph: {
    title: "Opening Explorer | Chessium",
    description: "Explore and learn chess openings with interactive boards.",
    type: "website",
  }
};

export default function OpeningsPage() {
  return <OpeningsClient />;
}
