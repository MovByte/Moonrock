const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const express = require('express');
const app = express();
const axios = require('axios');
require('dotenv').config();

var scopes = ['identify', 'email'];
 
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: scopes
},
function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ discordId: profile.id }, function(err, user) {
        return cb(err, user);
    });
}));

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', async (req, res) => {
    const code = req.query.code;
    const params = new URLSearchParams();
    params.append('client_id', process.env.DISCORD_CLIENT_ID); // Use environment variable
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET); // Use environment variable
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', process.env.DISCORD_CALLBACK_URL); // Use environment variable

    try {
        const response = await axios.post('https://discord.com/api/oauth2/token', params);
        const { access_token, token_type } = response.data;

        const userDataResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        });

        const user = {
            username: userDataResponse.data.username,
            email: userDataResponse.data.email,
            avatar: userDataResponse.data.avatar ? `https://cdn.discordapp.com/avatars/${userDataResponse.data.id}/${userDataResponse.data.avatar}.png` : null
        };

        // Here you can save the user information to your database or session
        // Then redirect the user to a logged-in area of your site

        return res.send(`
            <div style="margin:  300px auto;
            max-width:  400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: sans-serif;">
                <h3>Welcome ${user.username}</h3>
                <span>Email: ${user.email}</span>
                ${user.avatar ? `<img src="${user.avatar}"/>` : ''}
            </div>
        `);
    } catch (error) {
        console.log('Error', error);
        return res.send('An error occurred while processing your request.');
    }
});

app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));