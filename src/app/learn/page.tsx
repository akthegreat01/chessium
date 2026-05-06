import { Metadata } from 'next';
import LearnContent from './LearnContent';

export const metadata: Metadata = {
  title: 'Learn Chess — Tactics, Strategy & Underpromotion',
  description: 'Master chess with in-depth articles on tactics, strategy, famous games, underpromotion techniques, and grandmaster insights. Free educational chess content for all levels.',
  keywords: ['learn chess', 'chess tactics', 'chess strategy', 'underpromotion', 'chess lessons', 'chess education', 'brilliant moves', 'chess sacrifices'],
};

export default function LearnPage() {
  return <LearnContent />;
}
