# Vercel Blob Integration

This project now includes full integration with [Vercel Blob](https://vercel.com/docs/storage/vercel-blob), a managed file storage service.

## Setup

### 1. Get Your Blob Token

1. Go to [Vercel Console](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Storage** → **Blob**
4. Create a new Blob store or select an existing one
5. Copy the read/write token

### 2. Add Environment Variable

Add your Blob token to your environment:

```bash
# .env.local
BLOB_READ_WRITE_TOKEN=your_token_here
```

For Vercel deployments, add it in your **Project Settings** → **Environment Variables**.

## Usage

### Utility Functions

Import from `src/lib/blob.ts`:

```typescript
import {
  uploadBlob,
  deleteBlob,
  listBlobs,
  getBlobMetadata,
  copyBlob,
} from "@/lib/blob";
```

#### Upload a File

```typescript
import { uploadBlob } from "@/lib/blob";

const blob = await uploadBlob("documents/file.pdf", file, {
  contentType: "application/pdf",
  cacheControlMaxAge: 31536000, // 1 year
});

console.log(blob.url); // https://your-blob-store.vercel-storage.com/...
```

#### Delete a File

```typescript
import { deleteBlob } from "@/lib/blob";

await deleteBlob("documents/file.pdf");
```

#### List Files

```typescript
import { listBlobs } from "@/lib/blob";

const { blobs } = await listBlobs({ prefix: "documents/", limit: 100 });
blobs.forEach((blob) => console.log(blob.pathname, blob.size));
```

#### Get File Metadata

```typescript
import { getBlobMetadata } from "@/lib/blob";

const metadata = await getBlobMetadata("documents/file.pdf");
console.log(metadata.size, metadata.uploadedAt);
```

#### Copy a File

```typescript
import { copyBlob } from "@/lib/blob";

await copyBlob("documents/file.pdf", "archived/file.pdf");
```

### API Routes

The project includes a ready-to-use API route at `/api/blob` with the following endpoints:

#### Upload File

```bash
POST /api/blob
Content-Type: multipart/form-data

file=<binary>
pathname=optional/custom/path.pdf
```

Example with fetch:

```typescript
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("pathname", "uploads/my-file.pdf");

const response = await fetch("/api/blob", {
  method: "POST",
  body: formData,
});

const blob = await response.json();
console.log(blob.url);
```

#### Delete File

```bash
DELETE /api/blob
Content-Type: application/json

{ "pathname": "documents/file.pdf" }
```

Example:

```typescript
await fetch("/api/blob", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ pathname: "documents/file.pdf" }),
});
```

#### List Files

```bash
GET /api/blob?action=list&prefix=documents/&limit=50
```

Example:

```typescript
const response = await fetch("/api/blob?action=list&prefix=documents/");
const { blobs } = await response.json();
```

#### Get File Metadata

```bash
GET /api/blob?action=head&pathname=documents/file.pdf
```

Example:

```typescript
const response = await fetch(
  "/api/blob?action=head&pathname=documents/file.pdf"
);
const metadata = await response.json();
```

## Best Practices

1. **Organize with Prefixes**: Use folder-like structures with forward slashes
   ```typescript
   await uploadBlob("users/123/avatar.jpg", file);
   await uploadBlob("posts/456/images/cover.jpg", file);
   ```

2. **Set Content Types**: Always specify the MIME type for proper browser handling
   ```typescript
   await uploadBlob("file.pdf", file, { contentType: "application/pdf" });
   ```

3. **Use Cache Control**: Optimize performance with cache headers
   ```typescript
   // Cache for 1 year (use for immutable assets)
   await uploadBlob("assets/hash-123.js", file, {
     cacheControlMaxAge: 31536000,
   });

   // Don't cache (use for dynamic content)
   await uploadBlob("data/latest.json", file, {
     cacheControlMaxAge: 0,
   });
   ```

4. **Error Handling**: Always wrap blob operations in try-catch
   ```typescript
   try {
     await uploadBlob("file.txt", file);
   } catch (error) {
     console.error("Upload failed:", error);
   }
   ```

5. **Security**: Don't expose tokens in client-side code
   - Keep `BLOB_READ_WRITE_TOKEN` server-side only
   - Use API routes to handle uploads/deletions from the client
   - Implement proper authorization checks in your API routes

## Files Added

- `src/lib/blob.ts` - Utility functions for Blob operations
- `src/pages/api/blob.ts` - API route handlers
- `.env.example` - Environment variable template

## Environment Variables

```
BLOB_READ_WRITE_TOKEN=<your_token>
```

This is automatically validated by `src/config/env.ts` on server startup.

## References

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [@vercel/blob NPM Package](https://www.npmjs.com/package/@vercel/blob)
