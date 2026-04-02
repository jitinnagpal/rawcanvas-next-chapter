

## Add Privacy Policy Page

### What
Create a dedicated `/privacy-policy` page with the provided content and wire up the existing placeholder link in the footer.

### Steps

1. **Create `src/pages/PrivacyPolicy.tsx`** — A new page component rendering the full privacy policy content as styled HTML/JSX. Will include the Header and Footer components for consistent layout, with proper heading hierarchy, lists, and mailto/tel links.

2. **Add route in `src/App.tsx`** — Add `<Route path="/privacy-policy" element={<PrivacyPolicy />} />` above the catch-all route.

3. **Update footer link in `src/components/Footer.tsx`** — Change `<a href="#">Privacy Policy</a>` to use React Router's `<Link to="/privacy-policy">` so it navigates without a full page reload.

### Design Notes
- Page will use the same `container-max` and `section-padding` classes for consistent spacing
- Typography will follow existing Tailwind prose/heading styles used across the site
- Header + Footer wrapper matches the Index page pattern
- Page will scroll to top on mount

