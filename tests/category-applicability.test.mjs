import assert from "node:assert/strict";
import test from "node:test";
import {
  getApplicableCategoryTags,
  PRODUCT_CATEGORIES,
  SERVICE_CATEGORIES,
} from "../types/categories.ts";

const findCategory = (categories, id) => {
  const category = categories.find((item) => item.id === id);
  assert.ok(category, `Expected category "${id}" to exist`);
  return category;
};

const findTag = (tags, id) => tags.find((tag) => tag.id === id);

test("fashion requirements are limited to subcategories where they apply", () => {
  const fashion = findCategory(PRODUCT_CATEGORIES, "fashion");
  const clothingTags = getApplicableCategoryTags(fashion, "womens-clothing");
  const bagTags = getApplicableCategoryTags(fashion, "bags");

  assert.equal(findTag(clothingTags, "size")?.required, false);
  assert.equal(findTag(clothingTags, "clothing-type")?.required, true);
  assert.equal(findTag(bagTags, "size"), undefined);
  assert.equal(findTag(bagTags, "clothing-type"), undefined);
});

test("electronics storage capacity is limited to devices with storage", () => {
  const electronics = findCategory(PRODUCT_CATEGORIES, "electronics");

  assert.ok(
    findTag(getApplicableCategoryTags(electronics, "phones"), "storage"),
  );
  assert.equal(
    findTag(getApplicableCategoryTags(electronics, "audio"), "storage"),
    undefined,
  );
});

test("automotive vehicle details are not requested for parts and accessories", () => {
  const automotive = findCategory(PRODUCT_CATEGORIES, "automotive");
  const vehicleTags = getApplicableCategoryTags(automotive, "cars");
  const accessoryTags = getApplicableCategoryTags(automotive, "parts");

  assert.ok(findTag(vehicleTags, "model"));
  assert.ok(findTag(vehicleTags, "year"));
  assert.equal(findTag(accessoryTags, "model"), undefined);
  assert.equal(findTag(accessoryTags, "year"), undefined);
});

test("food expiry and pet flavor details are scoped to relevant products", () => {
  const food = findCategory(PRODUCT_CATEGORIES, "food-groceries");
  const petSupplies = findCategory(PRODUCT_CATEGORIES, "pet-supplies");

  assert.equal(
    findTag(getApplicableCategoryTags(food, "baking"), "expiry"),
    undefined,
  );
  assert.equal(
    findTag(getApplicableCategoryTags(food, "specialty-foods"), "expiry")
      ?.required,
    false,
  );
  assert.equal(
    findTag(getApplicableCategoryTags(petSupplies, "pet-food"), "flavor")
      ?.required,
    false,
  );
  assert.equal(
    findTag(getApplicableCategoryTags(petSupplies, "pet-beds"), "flavor"),
    undefined,
  );
});

test("service tech stack is optional and limited to technical subcategories", () => {
  const programming = findCategory(SERVICE_CATEGORIES, "programming-tech");
  const developmentTags = getApplicableCategoryTags(programming, "web-dev");
  const supportTags = getApplicableCategoryTags(programming, "it-support");

  assert.equal(findTag(developmentTags, "tech-stack")?.required, false);
  assert.equal(findTag(supportTags, "tech-stack"), undefined);
});

test("all tag subcategory references belong to their category", () => {
  for (const category of [...PRODUCT_CATEGORIES, ...SERVICE_CATEGORIES]) {
    const tags = [
      ...category.requiredTags,
      ...(category.recommendedTags ?? []),
      ...category.subcategories.flatMap(
        (subcategory) => subcategory.requiredTags ?? [],
      ),
    ];
    const subcategoryIds = new Set(
      category.subcategories.map((subcategory) => subcategory.id),
    );

    for (const tag of tags) {
      for (const subcategoryId of tag.subcategoryIds ?? []) {
        assert.ok(
          subcategoryIds.has(subcategoryId),
          `${category.id}.${tag.id} references unknown subcategory "${subcategoryId}"`,
        );
      }
    }
  }
});
