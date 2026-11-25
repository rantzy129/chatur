import { notFound } from "next/navigation";

/**
 * Decoy route for legacy /redgate.
 * Returns an authentic 404 response to bots and scanners that discovered the route.
 */
export default function RedgateDecoy() {
  notFound();
}
