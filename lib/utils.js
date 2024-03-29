module.exports = {
  make_date_from_regex_match: function(date) {
    month = date[1];
    day = date[2];
    let x = new Date(`2021, ${month} ${day}`);
    return `${x.getUTCFullYear()}-${("0" + (x.getUTCMonth() + 1)).slice(-2)}-${(
      "0" + x.getUTCDate()
    ).slice(-2)}`;
  },
  round: function(n, p = 2) {
    let k = 10 ** p;
    return Number(Number(Math.round(n * k, p) / k).toFixed(p));
  },
};
