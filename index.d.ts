// TODO: The Moonrock SDK will return this from every API that is proxied
interface GameEntry {
  name: string;
  description: string;
  tags: string[];
  minAge: number;
  resources: {
    thumbnailUrl: string;
    siteUrl: string;
  };
}
type GameListing = GameEntry[];
