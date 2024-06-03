function wareki(year) {
  let year_string = Utilities.formatDate(year,"JST", "yyyy").toString();
  let n = parseInt(year_string)

  let result;
  if (n >= 2019) {
    result = "R" + (n - 2018);
  } else if (n >= 1989) {
    result = "H" + (n - 1988);
  } else if (n >= 1926) {
    result = "S" + (n - 1925);
  } else if (n >= 1912) {
    result = "T" + (n - 1911);
  } else if (n >= 1868) {
    result = "M" + (n - 1867);
  } else {
    result = "error";
  }
  return result;
}
