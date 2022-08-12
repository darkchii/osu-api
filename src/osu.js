require('dotenv').config();
const axios = require('axios').default;

async function Login(client_id, client_secret) {
  const data = {
    client_id,
    client_secret,
    grant_type: 'client_credentials',
    scope: 'public',
  };

  try {
    const res = await axios.post('https://osu.ppy.sh/oauth/token', data);
    return res.data.access_token;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function AuthorizedApiCall(url, type = 'get', api_version = null) {
  const login_token = await Login(process.env.OSU_CLIENT_ID, process.env.OSU_CLIENT_SECRET);

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${login_token}`,
    // 'x-api-version': 20220704
  };
  if (api_version != null) {
    headers['x-api-version'] = api_version;
  }

  let res;

  switch (type) {
    case 'get':
      res = await axios.get(url, {
        headers
      });
      break;
    case 'post':
      res = await axios.post(url, {
        headers
      });
      break;
  }

  return res;
}

module.exports.GetUser = GetUser;
async function GetUser(username, mode = 'osu', key = 'username') {
  const res = await AuthorizedApiCall(`https://osu.ppy.sh/api/v2/users/${username}/${mode}?key=${key}`);
  try {
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
