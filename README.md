# Namma Meter · ನಮ್ಮ ಮೀಟರ್

**Meter running. Volume full.**

Kannada radio from a Bangalore auto — YouTube audio only, no video UI, no moods.

## Brand

| | |
|---|---|
| Name | **Namma Meter** |
| Kannada | ನಮ್ಮ ಮೀಟರ್ |
| Subtitle | Meter running. Volume full. |
| Accent | Auto yellow `#F5C518` · meter green `#3DDC84` |

Identity: `src/lib/brand.ts`

## Playback

- Hidden **YouTube IFrame API** (audio only — video not shown)
- Custom glass pill: thumbnail, title, prev / play / next
- Playlist: `src/data/playlist.ts`

```ts
export const playlist = {
  id: "PLJjBNE6iPKm0",
  url: "https://www.youtube.com/playlist?list=PLJjBNE6iPKm0",
};
```

## Develop

```bash
cd site
npm install
npm run dev
```

## Deploy

```bash
npm run build
```
