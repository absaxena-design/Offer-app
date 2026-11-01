# Connect the live Supabase project to ARXA

The frontend has been configured with the project's **public** Supabase URL and **publishable** key (no service-role credentials). GitHub Pages remains the host.

## Required one-time database setup

1. Open https://supabase.com/dashboard/project/ljuhuajevqiltynibvli/sql/new
2. In the repository open [the initial SQL migration](../supabase/migrations/202611010001_arxa_initial.sql).
3. Copy the **entire SQL file** into the Supabase SQL Editor and choose **Run**.
4. Verify that `public.watchlist_records` appears in **Table Editor** and that Row Level Security is enabled.
5. Under Authentication → Providers, ensure Email is enabled.
6. Under Authentication → URL Configuration, set Site URL to `https://absaxena-design.github.io/Offer-app/` and add the same full URL as an allowed redirect. Check your email-confirmation settings.

## Test

1. Open https://absaxena-design.github.io/Offer-app/ after its newest GitHub Pages deployment succeeds.
2. Choose **Sign in** in the header and create an account. Confirm your email if Supabase requests it.
3. Sign in and add a *new* product. It should appear in your watchlist.
4. Open ARXA in another browser, sign in to the same account, and verify the product appears there.
5. To copy **previously saved browser products**, open Account and click **Import browser products**. The browser data isn't deleted.
6. Test sign-out and sign-in again. If a sync error appears, review whether the SQL was run successfully.

## Security and limitations

- The publishable key and project URL are public identifiers and visible in the browser by design. **Never** commit a Supabase secret key, service-role key or database password.
- The SQL enables RLS and only allows a signed-in user to access rows belonging to that user.
- V1 uses a JSONB payload for backward compatibility with existing records. A normalized offers/prices/purchases schema will follow.
- Saved images remain embedded as small data URLs in records for this prototype. Move them to object storage before production.
- Cloud writes currently occur over REST. An offline queue, optimistic rollback on failure, realtime collaboration, and automatic retailer price checks are **not yet implemented**.
- Avoid setting up billed infrastructure or paid product-data providers during the free-first MVP.
