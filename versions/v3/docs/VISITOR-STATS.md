# Private visitor counts

Counts are stored in your Cloudflare account, Workers KV → VISITORS. No public statistics page or read API exists.

From versions/v3, with the existing Cloudflare login and Wrangler installed:

```sh
node scripts/visitors.mjs
node scripts/visitors.mjs 2026-10-22
```

The report shows total distinct anonymous browser identifiers and daily visitors (UTC). Clearing browser storage or using another device creates a new identifier; this is an estimate of visitors, not verified people. Daily entries expire after 400 days. No name, IP address, user-agent, or browsing history is stored. A random local browser identifier is hashed before storage. Local previews are excluded. Requests with malformed IDs or foreign origins are rejected. Like other client analytics, blocked storage, bots and ad blockers can affect counts.
