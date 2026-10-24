import assert from "node:assert/strict";
import test from "node:test";
import {
  ArchiveListingError,
  archiveListingRequest,
  replaceWithArchivedListing,
} from "../services/archive-listing.ts";
import { setBearerAuthorizationHeader } from "../services/auth-headers.ts";

test("archive request uses the listing archive route without a request body", async () => {
  const calls = [];
  const archived = { id: "listing 123", status: "archived" };
  const result = await archiveListingRequest((...args) => {
    calls.push(args);
    return Promise.resolve({
      data: {
        success: true,
        message: "Listing archived successfully",
        data: archived,
      },
    });
  }, "listing 123");

  assert.deepEqual(calls, [["/catalog/listings/listing%20123/archive"]]);
  assert.equal(result.status, "archived");
});

test("archive request accepts the idempotent already-archived response", async () => {
  const result = await archiveListingRequest(
    () =>
      Promise.resolve({
        data: {
          success: true,
          message: "Listing is already archived",
          data: { id: "listing-1", status: "archived" },
        },
      }),
    "listing-1",
  );

  assert.equal(result.status, "archived");
});

test("archive request preserves 401 and 404 status for existing UI handling", async () => {
  for (const status of [401, 404]) {
    await assert.rejects(
      archiveListingRequest(
        () =>
          Promise.reject({
            response: { status, data: { message: `HTTP ${status}` } },
          }),
        "listing-1",
      ),
      (error) => error instanceof ArchiveListingError && error.status === status,
    );
  }
});

test("successful archive updates seller state without changing the prior state object", () => {
  const active = [
    { id: "listing-1", status: "published", title: "Camera" },
    { id: "listing-2", status: "published", title: "Service" },
  ];
  const archived = { id: "listing-1", status: "archived", title: "Camera" };
  const updated = replaceWithArchivedListing(active, archived);

  assert.deepEqual(updated, [archived, active[1]]);
  assert.equal(active[0].status, "published");
});

test("auth header helper keeps the existing bearer-token format", () => {
  assert.deepEqual(setBearerAuthorizationHeader({}, "access-token"), {
    Authorization: "Bearer access-token",
  });
});

test("archive request rejects an unconfirmed backend response", async () => {
  await assert.rejects(
    archiveListingRequest(
      () => Promise.resolve({ data: { success: false, data: {} } }),
      "listing-1",
    ),
    ArchiveListingError,
  );
});
