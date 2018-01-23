const request = require("request-promise");
const SLACK_API = "https://slack.com/api";
const SLACK_TOKEN = process.env.SLACK_TOKEN;

async function getSlackUserByEmail(email) {
  const url = `${SLACK_API}/users.lookupByEmail?token=${SLACK_TOKEN}&email=${email}`;
  const res = await request.get(url, { json: true });
  return res.user;
}

function buildSetProfileUrl(userId, status, emoji) {
  const payload = { 
    status_text: status,
    status_emoji: emoji
  };
  
  const encodedPayload = encodeURIComponent(JSON.stringify(payload));
  return `${SLACK_API}/users.profile.set?token=${SLACK_TOKEN}&profile=${encodedPayload}&user=${userId}`;
}

async function setStatusForUser(userId, status, emoji) {
  const url = buildSetProfileUrl(userId, status, emoji);
  return request.post(url, { headers: { "Content-type": "application/x-www-form-urlencoded" } });
}

function _canChangeEmoji(currentEmoji, newEmoji) {
  const isEmpty = currentEmoji === "";
  const isDefault = currentEmoji === ":speech_balloon:";
  const isSame = currentEmoji === newEmoji;
  const isVacation = currentEmoji === ":palm_tree:";
  return isEmpty || isSame || isDefault || isVacation;
}

async function setStatus(email, { text, emoji }, canSetStatusForUser) {
  const slackUser = await getSlackUserByEmail(email);
  if (canSetStatusForUser(slackUser.profile.status_text)) {
    const newEmoji = _canChangeEmoji(slackUser.profile.status_emoji, emoji) ? emoji : slackUser.profile.status_emoji;
    await setStatusForUser(slackUser.id, text, newEmoji);
  } else {
    console.log(`${email} already has custom status`);
  }
}

module.exports = setStatus;
