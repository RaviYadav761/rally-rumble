# Rally Rumble — progress

## 2026-11-10 — reference pose and final local QA pass

- Added four optimized transparent WebP pose assets: Dozer idle/punch and Yatra idle/kick. Dozer switches to the attack silhouette during the punch's active timing window; Yatra switches to the extended kick silhouette during the kick's active window. Idle sprites and the full-body fallback remain in place. Other fighters retain the Canvas joint rig.
- Rechecked the Dozer bulldozer and Yatra aloo-to-sona supers in Chromium. The Yatra sequence shows the custom green machine, potato and falling gold bars; generated props and pose cutouts are shipped as optimized WebP rather than multi-megabyte PNG intermediates.
- Added the locally bundled `aloo-sona.mp3` cue; the announcer set now contains 12 original generic Hindi clips for round starts, specials, meme-style cues, warnings and results. No real-person voice is cloned and no source-video audio is copied.
- Desktop Chromium passed selection → loading → fight → pause/resume → two round wins → result. The test verified the default Dozer Dada vs Yatra Boy selection, all four pose images loaded, and no browser exceptions or failed requests.
- Touch-phone emulation verified that portrait displays the rotate gate and hides touch controls; after switching to landscape, the gate closes, the match can start, and touch controls appear. This is a browser emulation check, not physical Android testing.
- `node --check game.js`, `git diff --check`, and local HTTP 200 checks for the new pose, special-effect, stage and announcer assets passed.

## Deployment status

- `vercel.json` uses `outputDirectory: "."`; that configuration is already committed on `main`. The remaining release step is to push the new game/asset changes and smoke-test the exact user URL `https://rally-rumble-i8od.vercel.app/` for the new build. Do not claim the revision is live until that public check passes.
- No Vercel domains are to be repointed. Physical Android/fullscreen behavior and performance on real devices remain unverified.
