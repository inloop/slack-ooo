const request = require("request-promise");

const _extractEmail = vacation => {
  const approvalRequestExists = !!vacation.planApproval;
  return approvalRequestExists
    ? vacation.planApproval.requester.key
    : vacation.assignee.key;
};

const _extractDataForStatus = vacation => {
  const email = _extractEmail(vacation);
  const { start, end } = vacation;
  return { email, start, end };
}

const getUsersOnVacation = async date => {
  const url = `${process.env.TEMPO_ALLOCATIONS_URL}?assigneeType=user&startDate=${date}&endDate=${date}`;
  const vacations = await request.get(url, {
    auth: {
      user: process.env.TEMPO_USER,
      password: process.env.TEMPO_PASS
    },
    json: true
  });

  return vacations.map(_extractDataForStatus);
};

function getVacationsForToday() {
  const today = new Date().toISOString().split('T')[0]; //YYYY-MM-DD 
  return getUsersOnVacation(today);
}

async function getVacationsEndingYesterday() {
  const now = new Date();
  const yesterday = new Date(new Date(now).setDate(now.getDate() - 1)).toISOString().split('T')[0]; //YYYY-MM-DD
  const vacations = await getUsersOnVacation(yesterday);
  return vacations.filter(vacation => vacation.end === yesterday);
}

module.exports = { getUsersOnVacation, getVacationsForToday, getVacationsEndingYesterday };
