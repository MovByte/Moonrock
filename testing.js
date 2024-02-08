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
    params.append('client_id', process.env.DISCORD_CLIENT_ID);
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', process.env.DISCORD_CALLBACK_URL);

    try {
        const response = await axios.post('https://discord.com/api/oauth2/token', params);
        const { access_token, token_type } = response.data;

        const userDataResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        });
        const user = userDataResponse.data;
        console.log(user);
        return res.send(`
            <div style="margin: 300px auto; max-width: 400px; display: flex; flex-direction: column; align-items: center; font-family: sans-serif;">
                ${user.avatar ? `<img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}"/>` : ''}
                <h3>Welcome ${user.global_name}</h3>
                <!--<span>Email: ${user.email}</span>-->
            </div>
        `);
    } catch (error) {
        console.log('Error', error);
        return res.send('An error occurred while processing your request.');
    }
});

app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));