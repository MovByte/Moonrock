async function gamesApi() {
    const apiUrl = `https://yandex.com/games/api/catalogue/v3/search/?query=Minecraft`;
        try {
            const apiResponse = await fetch(apiUrl, {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                    "Accept-Language": "en,en-US;q=0.5",
                    "Prefer": "safe",
                    "Upgrade-Insecure-Requests": "1",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "cross-site"
                },
                "method": "GET",
                "mode": "cors"
            });
            console.log(apiResponse)
            console.log(apiResponse.result)
            const responseJson = await apiResponse.json();
            console.log(responseJson.result)
            console.log(responseJson)
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

gamesApi();