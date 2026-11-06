# Rally Rumble

Rally Rumble is an original browser-native 2D fighting game prototype. It borrows the broad interaction pattern of a landscape arcade fighter from the supplied reference, but uses original names, procedural vector fighters, original copy, and original stage art.

## Run locally

Serve the repository root with any static HTTP server, for example:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

## Controls

Use `A/D` or the arrow keys to move, `W` or Up to jump, `S` or Down to crouch, and hold the direction away from the opponent to block. Use `J` for punch, `K` for kick, `I` for grab, and `L` or Space for super when the meter is full. Press `Esc` to pause and `M` to mute.

Mobile players get on-screen directional and attack buttons after starting a fight. The layout is designed for landscape play but remains usable on smaller screens.

## Replacing the placeholder character

The current fighters are drawn by `drawFighter()` in `game.js` so the game has no external asset dependency. A supplied sprite or PNG can be integrated in that function later, preserving the `Fighter` state and combat methods.

## License note

This repository intentionally does not include the reference site's characters, logos, artwork, text, or other proprietary assets.
