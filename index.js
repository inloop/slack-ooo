require("dotenv").config();

const CronJob = require("cron").CronJob;
const Vacations = require("./src/vacations");

async function updateStatuses() {
  // Remove statuses for vacations ending yesterday
   await Vacations.removeVacationStatuses();

  // Set statuses for users who are currently on vacation
   await Vacations.setVacationStatuses();
}

const job = new CronJob({
  cronTime: process.env.CRON_PATTERN,
  onTick: updateStatuses,
  start: false,
  timeZone: process.env.TIMEZONE,
});

job.start();
