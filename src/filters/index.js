function unformatPrice(numeric) {
    numeric = numeric.toString()
    numeric = numeric.replace(/\,/g, '');
    return numeric;
  };
  
  function formatePrice(num, comma, period) {
    comma = comma || ',';
    period = period || '.';
    var split = num.toString().split('.');
    var numeric = split[0];
    var decimal = split.length > 1 ? period + split[1] : '';
    numeric = numeric.replace(/\,/g, '');
    var reg = /(\d+)(\d{3})/;
    while (reg.test(numeric))
      numeric = numeric.replace(reg, '$1' + comma + '$2');
    return numeric + decimal;
  };
  
  function toDecimal(number, decimal) {
    var regExpr = /[^0-9.-]/g;
    number = parseFloat(("" + number).replace(regExpr, ''));
    return (number ? decimal == null ? number : parseFloat(number.toFixed(toDecimal(decimal, null))) : 0);
  };
  
  export default {
    convertCommaString(number, decimal = config.amtdecimal) {
      return formatePrice(toDecimal(number, decimal));
    },
    convertStringToNumber(number) {
      return parseFloat(unformatPrice(toDecimal(number)));
    },
    capitalize(s) {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    }
  }