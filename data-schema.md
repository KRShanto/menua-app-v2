# Menu App - Firestore Database Schema

This document outlines the Firestore database schema used in the Menu App application. The schema is designed to support a bilingual (English/Arabic) restaurant menu with categories, items, discounts, and customer feedback functionality.

## Collections Overview

| Collection Name | Purpose |
|-----------------|---------|
| `production__menu` | Stores all menu items with their details |
| `production__discount` | Stores discount information for menu items |
| `production__feedback` | Stores customer feedback submissions |
| `production__index` | Stores the ordering of categories |
| `production__discount_index` | Stores the ordering of discounted items |
| `production__category_images` | Stores images for categories |
| `production__manager` | Stores information about managers/administrators |

## Detailed Collection Schemas

### 1. `production__menu` Collection

This is the main collection storing menu items.

**Document Structure:**

```typescript
{
  id: string;                  // Document ID
  name: string;                // Item name in English
  name_arab: string;           // Item name in Arabic
  category: string;            // Category name in English
  category_arab: string;       // Category name in Arabic
  calories: string;            // Calorie information
  price: number;               // Original price
  description: string;         // Description in English
  description_arab: string;    // Description in Arabic
  likes: string;               // Number of likes (stored as string)
  imageURL: string;            // URL to the item image
  index?: number;              // Optional sorting index within category
}
```

### 2. `production__discount` Collection

Stores discount information for menu items.

**Document Structure:**

```typescript
{
  id: string;                  // Document ID
  itemId: string;              // Reference to menu item ID
  rate: number;                // Discount percentage (0-100)
}
```

### 3. `production__feedback` Collection

Stores customer feedback.

**Document Structure:**

```typescript
{
  phoneNumber: string;         // Customer phone number
  feedback: string;            // Feedback text
  createdAt: Timestamp;        // Timestamp when feedback was submitted
}
```

### 4. `production__index` Collection

Stores the ordering of categories.

**Document Structure:**

```typescript
{
  // Single document with category names as keys and index values
  [categoryName: string]: number;  // Category name to index mapping
}
```

### 5. `production__discount_index` Collection

Stores the ordering of discounted items.

**Document Structure:**

```typescript
{
  // Single document with discount IDs as keys and index values
  [discountId: string]: number;    // Discount ID to index mapping
}
```

### 6. `production__category_images` Collection

Stores images for categories.

**Document Structure:**

```typescript
{
  // Single document with category names as keys and image URLs as values
  [categoryName: string]: string;  // Category name to image URL mapping
}
```

### 7. `production__manager` Collection

Stores information about managers/administrators.

**Document Structure:**

```typescript
{
  // Likely contains manager information
  id: string;                  // Document ID
  name: string;                // Manager name
  role: string;                // Role/position
  imageURL: string;            // Profile image (with default at MANAGER_DEFAULT_IMAGE)
}
```

## Relationships

1. **Menu Items to Categories**: Menu items belong to categories (denoted by the `category` field)
2. **Discounts to Menu Items**: Discounts apply to specific menu items (via `itemId` reference)
3. **Categories to Ordering**: Categories have ordering defined in the index collection
4. **Discounted Items to Ordering**: Discounted items have ordering defined in the discount index collection
5. **Categories to Images**: Categories have images defined in the category images collection

## Data Flow

1. The app fetches menu items and discounts in parallel
2. Discounts are applied to menu items based on the itemId reference
3. Menu items are grouped by category
4. Categories and items within categories are sorted based on index collections
5. A separate list of discounted items is maintained for promotional displays

## Performance Considerations

- The schema uses separate collections for different entity types, which helps with query performance
- Index collections are used for efficient sorting of categories and discounted items
- The application implements caching to reduce database reads
- Optimized queries with filters, limits, and ordering are used to minimize data transfer

## Bilingual Support

The schema supports both English and Arabic languages through dedicated fields:

- `name` and `name_arab` for item names
- `category` and `category_arab` for category names
- `description` and `description_arab` for item descriptions

This design allows for seamless language switching without additional database queries.
