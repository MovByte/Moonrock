# Moonrock - Dev Docs

You may search with text and tags. If the game site has a built-in search feature, it will use the game site's search API, or if they don't have one else, it will use our own index and crawler. If the query is a URL, it will just function like a normal web proxy. NSFW games (newgrounds) will be marked accordingly. If duplicates are found, there will be a mirror button on the results, so you can choose which games you want to proxy. Speaking of proxies, the links are not opened on an external site; however, they are placed inside the site's internal player. There is automatic proxy game scraping. Flash games will be emulated. This is done without any framing! Any bookmarked game is available offline (unless tagged as offline) just like the rest of the site, despite the search functionality.

[If using a cellular device](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/type), you will be prompted if you want to download your favorite games for offline use automatically for that session. On this prompt, there will be a checkmark to save the preference. In settings, you may disable automatic downloads on any device.
Favorite games will have different colors corresponding to: HTML, Flash, and Emulator. NSFW games would be blurred and labeled 18+ if chosen to. If you choose in settings, you could have them in separate labeled categories. You can also drag around the favorite games to your liking.

If you want, you can also link your Discord account to log in (proxified of course, unless you opt out of proxified links in settings) and get your stats for your playtime, most played games, leaderboards, and much more.

## How Flash will be emulated

We will use Ruffle, and if the game doesn't work on Ruffle, it will try [Lightspark](https://lightspark.github.io), and if that doesn't work the fallback will be [CheerpX](https://labs.leaningtech.com/cheerpx-for-flash/getting-started), which supports all of them.

## How emulated games will work

There will also be [the RetroArch Web Player](https://web.libretro.com/) built into the site. When you click on a download link for a rom file, it will prompt if you want to save it to your computer or save it to the emulator.

## Game sites that Moonrock will support

- [ ] [Yandex Games](https://yandex.games)
- [ ] [Crazy Games](https://www.crazygames.com)
- [ ] [Kongregate](https://www.kongregate.com)
- [ ] [Armor Games](https://armorgames.com)
- [ ] [itch](https://itch.io)
- [ ] [Newgrounds](https://www.newgrounds.com)
- [ ] [now.gg](https://now.gg)
- [ ] [Flashpoint Web](https://ooooooooo.ooo)
- [ ] Support for several game categories on the [Software Library](https://archive.org/details/softwarelibrary_msdos_games)
- ...
