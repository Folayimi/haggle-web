export type ArchiveListingResponse<TListing extends { id: string }> = {
  success: true;
  message: "Listing archived successfully" | "Listing is already archived";
  data: TListing & { status: "archived" };
};

export class ArchiveListingError extends Error {
  readonly status?: number;

  constructor(
    message: string,
    status?: number,
  ) {
    super(message);
    this.name = "ArchiveListingError";
    this.status = status;
  }
}

export function replaceWithArchivedListing<
  TListing extends { id: string; status?: string },
>(
  listings: TListing[],
  archivedListing: TListing & { status: "archived" },
): TListing[] {
  return listings.map((listing) =>
    listing.id === archivedListing.id ? archivedListing : listing,
  );
}

type Patch = (
  url: string,
) => Promise<{ data: ArchiveListingResponse<{ id: string }> }>;

export async function archiveListingRequest<TListing extends { id: string }>(
  patch: Patch,
  listingId: string,
): Promise<TListing & { status: "archived" }> {
  let response: { data: ArchiveListingResponse<TListing> };
  try {
    response = await patch(
      `/catalog/listings/${encodeURIComponent(listingId)}/archive`,
    ) as { data: ArchiveListingResponse<TListing> };
  } catch (error) {
    const candidate = error as {
      response?: { status?: number; data?: { message?: string; error?: string } };
    };
    throw new ArchiveListingError(
      candidate.response?.data?.message ||
        candidate.response?.data?.error ||
        (error instanceof Error ? error.message : "Unable to archive this listing."),
      candidate.response?.status,
    );
  }

  if (
    response.data?.success !== true ||
    response.data.data?.id !== listingId ||
    response.data.data?.status !== "archived"
  ) {
    throw new ArchiveListingError(
      "The server did not confirm that this listing was archived.",
    );
  }

  return response.data.data;
}
