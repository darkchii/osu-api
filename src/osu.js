require('dotenv').config();
const axios = require('axios').default;

let stored_token = null;
let refetch_token = null;

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
  if(stored_token === null || refetch_token === null || refetch_token < Date.now()) {
    stored_token = await Login(process.env.OSU_CLIENT_ID, process.env.OSU_CLIENT_SECRET);
    refetch_token = Date.now() + 3600000;
    console.log('new token');
  }

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${stored_token}`,
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
