# Invite landing pages

`/i` is a peer invite, `/r` is a room invite. Both are the same page with a
different `data-action` on `<html>`; keep them in sync.

## How an invite travels

The client mints `https://doubleslash.space/i#<base64url payload>`. The payload
is in the **fragment**, so:

- this site never receives it (browsers do not send fragments to servers), and
- a link scanner that pre-visits the URL cannot burn a single-use invite token.

The page reads `location.hash`, decodes it locally to show who is inviting, and
navigates to `doubleslash://invite#<payload>` to open an installed client. If no
client is registered for the scheme, nothing happens and the page stays put with
its download link.

The hand-off uses `doubleslash://`, **not** `d://` — Chromium's Windows URL
fixup reads the one-letter `d:` as drive D:. `rust/conquerd-features/src/brand.rs`
is the source of truth for both forms.

## Android App Links

`/.well-known/assetlinks.json` makes Android route these links straight to the
app with no chooser dialog. It ships with a placeholder fingerprint and will not
verify until that is replaced:

```
keytool -list -v -keystore <release.jks> -alias <alias> | grep SHA256
```

Paste the colon-separated SHA-256 into `sha256_cert_fingerprints`. Verify after
deploying with:

```
adb shell pm verify-app-links --re-verify com.conquerd.client
adb shell pm get-app-links com.conquerd.client
```

Until then the manifest's `autoVerify` filter simply falls back to the chooser,
and the `doubleslash://` hand-off still works.
