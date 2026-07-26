import { Location } from "@/types";

export function formatLocation(location: Location): string {
  return `${location.city}, ${location.state}`;
}
