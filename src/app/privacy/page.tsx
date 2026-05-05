import PrivacyContent from './PrivacyContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Chessium',
  description: 'Learn how Chessium protects your data and privacy. Our commitment to secure, transparent chess analysis.',
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
