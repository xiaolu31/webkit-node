description('This test aims to check for rangeOverflow flag with input fields');

var input = document.createElement('input');

function checkOverflow(value, max, disabled)
{
    input.value = value;
    input.max = max;
    input.disabled = !!disabled;
    var overflow = input.validity.rangeOverflow;
    var resultText = 'The value "' + input.value + '" ' +
        (overflow ? 'overflows' : 'doesn\'t overflow') +
        ' the maximum value "' + input.max + '"' + (disabled ? ' when disabled.' : '.');
    if (overflow)
        testPassed(resultText);
    else
        testFailed(resultText);
}

function checkNotOverflow(value, max, disabled)
{
    input.value = value;
    input.max = max;
    input.disabled = !!disabled;
    var overflow = input.validity.rangeOverflow;
    var resultText = 'The value "' + input.value + '" ' +
        (overflow ? 'overflows' : 'doesn\'t overflow') +
        ' the maximum value "' + input.max + '"' + (disabled ? ' when disabled.' : '.');
    if (overflow)
        testFailed(resultText);
    else
        testPassed(resultText);
}

// ----------------------------------------------------------------
debug('Type=text');
input.type = 'text';  // No overflow for type=text.
checkNotOverflow('101', '100');

// ----------------------------------------------------------------
debug('');
debug('Type=number');
input.type = 'number';
input.min = '';
checkNotOverflow('99', '100');  // Very normal case.
checkNotOverflow('-101', '-100');
checkNotOverflow('99', '1E+2');
checkNotOverflow('0.99', '1.00');
checkNotOverflow('abc', '100');  // Invalid value.
checkNotOverflow('', '-1');  // No value.
checkNotOverflow('101', '');  // No max.
checkNotOverflow('101', 'xxx');  // Invalid max.
// The following case should be rangeOverflow==true ideally.  But the "double" type doesn't have enough precision.
checkNotOverflow('0.999999999999999999999999999999999999999999', '0.999999999999999999999999999999999999999998');

// Overflow cases
checkOverflow('101', '100');
checkOverflow('-99', '-100');
checkOverflow('101', '1E+2');
input.min = '200';  // value < min && value > max
checkOverflow('101', '100');

// Disabled
checkNotOverflow('101', '1E+2', true);

var successfullyParsed = true;
