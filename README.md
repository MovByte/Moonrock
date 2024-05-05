# Moonrock: Game Site Search Engine and Aggregator

Moonrock is a versatile search engine and aggregator tailored specifically for gaming websites. This project aims to streamline the process of finding relevant information across various gaming platforms, providing users with a convenient and efficient way to discover content.

## Setup Instructions

1. **Rename Configuration File:**
   - Begin by renaming the `.env.example` file to `.env`. This file contains essential environment variables for configuring the application.

2. **Set Query Limit:**
   - Define the desired query limit by filling in the `QUERY_LIMIT` variable in the `.env` file. This limit determines the maximum number of results returned per query.

3. **Specify Port for Web Server:**
   - Choose the port on which the web server will operate by setting the `PORT` variable in the `.env` file.

4. **Create Discord Application:**
   - If not already created, generate a Discord application on the Discord Developer Portal.

5. **Configure Discord OAuth2 Settings:**
   - Obtain the `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` from your Discord application's OAuth2 settings.

6. **Set Callback URL for Authorization:**
   - Define the `DISCORD_CALLBACK_URL` variable in the `.env` file to specify the URL for authorization redirection after authentication.

7. **Ensure Session Security:**
   - Enhance security by providing a secure value for the `SESSION_SECRET` variable in the `.env` file to protect the session cookie.

8. **Choose Protocol for Deployment:**
   - Set the `SECURE` variable in the `.env` file to `true` for HTTPS or `false` for HTTP, depending on your deployment protocol.

## Credits

Moonrock owes its existence to the collaborative efforts of talented individuals who have contributed to its development and design:

- **Dave:**
  - Contributed code.
  - GitHub: [dave9123](https://github.com/dave9123)
  - Discord: [User Profile](https://discord.com/users/781708312466554940)

- **Whimsy:**
  - Designed the frontend.
  - GitHub: [InAWhimsicalManner](https://github.com/InAWhimsicalManner)
  - Discord: [User Profile](https://discord.com/users/1127936626883035227)

- **endlessvortex:**
  - Provided the original concept.
  - GitHub: [MovByte](https://github.com/MovByte)
  - Discord: [User Profile](https://discord.com/users/980548613614764093)

- **hypedhodi:**
  - Contributed to the original idea.
  - Discord: [User Profile](https://discord.com/users/1064073328589021214)

- **g9aerospace:**
  - Contributed to frontend development and design.
  - GitHub: [g9militantsYT](https://github.com/G9Aerospace)
  - Discord: [User Profile](https://discord.com/users/928267278540242964)
  - Website: [g9aerospace.in](https://g9aerospace.in/)
