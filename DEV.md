# Moonrock - Dev Docs

You may search with text and tags. If the game site has a built-in search feature it will use the game site's search api, or if they don't have one else it would use our own index and crawler. If the query is a url, it will just function like a normal web proxy. NSFW games (Newgrounds) will be marked accordingly. If duplicates are found, there will be a mirror button on the results, so you can choose which games that you want to proxy. Speaking proxies, the links are not opened and external site however they are placed inside the site's internal player there are automatic proxy game scraping. Flash games will be emulated. This is done without any iframing! Any bookmarked game is available offline (Unless tagged as offline) just like the rest of the site, despite the search functionality.

There will also be Retroarch built in to the site. When you click on a download link for a rom file it would prompt if you want to save it to your computer or save to Retroarch.


[If using a cellular device](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/type), you will be prompted if you want to download favorited games for offline use automatically for that session. On this prompt there will be a checkmark to save the preference. In settings you may disable automatic downloads on any device.
Favorited games will have different colors corresponding to: HTML, Flash, and Emulator. NSFW games would be blurred and labeled 18+ if chosen to) If you choose in settings you could have them in separate labeled categories. You can also drag around the favorites games to your liking.

If you want you can also link your Discord account to log-in (Proxified ofc, unless opted out of proxified links in settings) and get your stats for your playtime, most played games, leader boards, and much more.

## How flash will be emulated

We will use Ruffle, and if the game doesn't work on Ruffle, it will try https://lightspark.github.io/, and if that doesn't work the fallback will be CherpX, which supports all of them.

## Game sites that Moonrock will support

- [ ] [Yandex Games](https://yandex.games)
- [ ] [Crazy Games](https://www.crazygames.com)
- [ ] [Kongregate](https://www.kongregate.com)
- [ ] [Armor Games](https://armorgames.com)
- [ ] [itch](https://itch.io)
- [ ] [Newgrounds](https://www.newgrounds.com)
- [ ] [Flashpoint Web](https://ooooooooo.ooo)
- [ ] Support for several game categories on the [Software Library](https://archive.org/details/softwarelibrary_msdos_games)
- ...