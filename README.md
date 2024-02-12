# Moonrock
A search engine and aggregator for game sites.
## Setting Up
1. Rename .env.example to .env.
2. Fill QUERY_LIMIT with the limit you want for the query to be.
3. Fill PORT with the port you want the web server running on.
4. Make an application on [Discord Developer Portal](https://discord.com/developers) if you don't have one yet.
4. Fill DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET from Your Application -> OAuth2 -> General.
5. Fill DISCORD_CALLBACK_URL with the URL you want the authorization to redirect to (for example http://localhost/auth/discord/callback) and make sure to add the redirect.
6. Fill SESSION_SECRET with something to secure the cookie.
7. Fill SECURE with true if you use HTTPS and false if you use HTTP