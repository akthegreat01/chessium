import { getClubBySlug, getClubMembers } from "./src/lib/chess/clubs-db";

async function main() {
  const club = await getClubBySlug("jeeneetards");
  console.log("Club:", club);
  if (club) {
    const members = await getClubMembers(club.id);
    console.log("Members:", members);
  }
}
main();
