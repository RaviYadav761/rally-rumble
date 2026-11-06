# Rally Rumble

Rally Rumble is an original browser-native 2D fighting game with a festive night-arena theme. Choose a fictional fighter, challenge the CPU in a best-of-three match, build your Shakti meter, and watch for the timed Sutli Bomb. The characters and vector artwork are original; the project does not include real-person likenesses or copied reference-site assets.

## Run locally

Serve the repository root with any static HTTP server, for example:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

## Controls

On desktop, use `A/D` or the arrow keys to move, `W` or Up to jump, `S` or Down to crouch, and hold away from the opponent to block. Press `J` to punch, `K` to kick, `I` to grab, and `L` or Space for Super when the Shakti meter is full. Press `Esc` to pause and `M` to toggle sound.

On touch screens, use the virtual joystick and the four on-screen attack buttons. Landscape orientation is recommended.

## Game flow

The game includes fighter, arena and CPU-difficulty selection; 60-second rounds; first-to-two round scoring; a Shakti/super meter; CPU blocks and counters; a warning-and-explosion Sutli Bomb hazard; hit effects, Hindi/browser-voice fight calls and synthesized arcade audio; pause, newspaper-style match results and rematch.

## Customizing fighters

Fighter colors, style data and special-move names live in `fighterData` in `game.js`. `drawFighter()` draws the original vector characters; replace or extend that rendering function to add a later sprite sheet while keeping the `Fighter` combat state and methods intact.

## License note

The repository does not include the supplied video's characters, logos, artwork, audio, or other proprietary assets. Its festival arena and fighters are original fictional designs.
