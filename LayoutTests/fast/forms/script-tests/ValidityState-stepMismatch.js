description('Check stepMismatch results for number, and unsupported types.');

var input = document.createElement('input');
document.body.appendChild(input);

function stepMismatchFor(value, step, min, disabled) {
    input.min = min;
    input.step = step;
    input.value = value;
    input.disabled = !!disabled;
    return input.validity.stepMismatch;
}

debug('');
debug('Number type');
input.type = 'number';
debug('Empty values');
shouldBe('stepMismatchFor("", null, null)', 'false');
shouldBe('stepMismatchFor("", "1.0", "0.1")', 'false');
debug('Integers');
shouldBe('stepMismatchFor("1", "2", "0")', 'true');
shouldBe('stepMismatchFor("-3", "2", "-4")', 'true');
shouldBe('input.max = "5"; stepMismatchFor("5", "3", "0")', 'true');
shouldBe('input.value', '"5"');
debug('Invalid step values');
input.max = '';
shouldBe('stepMismatchFor("-3", "-2", "-4")', 'false');
shouldBe('stepMismatchFor("-3", null, "-4")', 'false');
shouldBe('stepMismatchFor("-3", undefined, "-4")', 'false');
debug('Huge numbers and small step; uncomparable');
shouldBe('stepMismatchFor("3.40282347e+38", "3", "")', 'false');
shouldBe('stepMismatchFor("3.40282346e+38", "3", "")', 'false');
shouldBe('stepMismatchFor("3.40282345e+38", "3", "")', 'false');
debug('Huge numbers and huge step');
shouldBe('stepMismatchFor("3.20e+38", "0.20e+38", "")', 'false');
shouldBe('stepMismatchFor("3.20e+38", "0.22e+38", "")', 'true');
debug('Fractional numbers');
shouldBe('stepMismatchFor("0.9", "0.1", "")', 'false');
shouldBe('stepMismatchFor("0.9", "0.1000001", "")', 'true');
shouldBe('stepMismatchFor("0.9", "0.1000000000000001", "")', 'false');
shouldBe('stepMismatchFor("1.0", "0.3333333333333333", "")', 'false');
debug('Rounding');
shouldBe('stepMismatchFor("5.005", "0.005", "4")', 'false');
debug('Disabled');
shouldBe('stepMismatchFor("1", "2", "0", true)', 'false');

debug('');
debug('Unsupported types');
shouldBe('input.type = "text"; input.step = "3"; input.min = ""; input.value = "2"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "button"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "checkbox"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "color"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "email"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "hidden"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "image"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "khtml_isindex"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "passwd"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "radio"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "reset"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "search"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "submit"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "tel"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "url"; input.validity.stepMismatch', 'false');
shouldBe('input.type = "file"; input.validity.stepMismatch', 'false');

var successfullyParsed = true;
