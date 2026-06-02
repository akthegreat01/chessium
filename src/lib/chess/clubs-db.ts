export interface Club {
  id: string;
  name: string;
  slug: string;
  description: string;
  owner_id: string;
  member_count: number;
}

// For showcase/AdSense purposes before fully authenticated userbase
export const MOCK_CLUBS: Club[] = [
  {
    id: "1",
    name: "The Gotham Knights",
    slug: "gotham-knights",
    description: "A community for aggressive players who love the Vienna Gambit and sacrificing the exchange.",
    owner_id: "user-1",
    member_count: 142
  },
  {
    id: "2",
    name: "Endgame Grindset",
    slug: "endgame-grindset",
    description: "We don't care about the opening. We just trade down and win in the endgame. Join if you know your Lucena.",
    owner_id: "user-2",
    member_count: 85
  },
  {
    id: "3",
    name: "Chessium Founders",
    slug: "chessium-founders",
    description: "The original club for early adopters of Chessium.",
    owner_id: "user-3",
    member_count: 420
  }
];

export async function getClubs(): Promise<Club[]> {
  // In a real app with Supabase initialized with clubs, we'd do:
  // const { data } = await supabase.from('clubs').select('*')
  // return data;
  
  return MOCK_CLUBS;
}

export async function getClubBySlug(slug: string): Promise<Club | null> {
  return MOCK_CLUBS.find(c => c.slug === slug) || null;
}
