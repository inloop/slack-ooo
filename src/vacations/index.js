const Tempo = require("../tempo");
const Slack = require("../slack");
const Helpers = require("./helpers");

/**
 * Status text can be changed if:
 * 1. Is empty
 * 2. Is status created by us
 * @param {*} slackUser 
 */
function _canChangeStatus(vacationStart, vacationEnd) {
  return function (currentSlackStatus) {
    const isStatusEmpty = currentSlackStatus === "";
    const isVacationStatus = currentSlackStatus === Helpers.buildStatusText(vacationStart, vacationEnd);
    return isStatusEmpty || isVacationStatus;
  }
}

function _setVacationStatus({ email, start, end }) {
  const text = Helpers.buildStatusText(start, end);
  const emoji = ":palm_tree:";
  return Slack.setStatus(email, { text, emoji }, _canChangeStatus(start, end));
}

function _removeVacationStatus({ email, start, end }) {
  const text = "";
  const emoji = "";
  return Slack.setStatus(email, { text, emoji }, _canChangeStatus(start, end));
}

async function setVacationStatuses() {
  const vacations = await Tempo.getVacationsForToday();
  console.log("Setting vacations", JSON.stringify(vacations));

  for(vacation of vacations) {
    try {
      await _setVacationStatus(vacation);
    } catch (error) {
      console.log(error)
    }
  }
}

async function removeVacationStatuses() {
  const vacations = await Tempo.getVacationsEndingYesterday();
  console.log("Removing vacations", JSON.stringify(vacations));

  for(vacation of vacations) {
    try {
      await _removeVacationStatus(vacation);
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = {setVacationStatuses, removeVacationStatuses};