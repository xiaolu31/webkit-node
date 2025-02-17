description('Tests for writing and reading .type property of HTMLInputElement.');

var input = document.createElement('input');
document.body.appendChild(input);

// The default type is "text".
shouldBe('input.type', '"text"');

function check(value, expected)
{
    input.type = value;
    if (input.type == expected)
        testPassed('input.type for "' + value + '" is correctly "' + input.type + '".');
    else
        testFailed('input.type for "' + value + '" is incorrectly "' + input.type + '", should be "' + expected + '".');
}

// The type is not specified explicitly.  We can change it to "file".
check("file", "file");
// http://webkit.org/b/57343
check("file", "file");
check("FILE", "file");

check("text", "text");
check("TEXT", "text");  // input.type must return a lower case value according to DOM Level 2.
check(" text ", "text");
check("button", "button");
check(" button ", "text");
check("checkbox", "checkbox");
check("email", "email");
check("file", "email"); // We can't change a concrete type to file for a security reason.
check("hidden", "hidden");
check("image", "image");
check("isindex", "text");
check("khtml_isindex", "");
check("number", "number");
check("password", "password");
check("passwd", "text");
check("radio", "radio");
check("range", "range");
check("reset", "reset");
check("search", "search");
check("submit", "submit");
check("tel", "tel");
check("telephone", "text");
check("url", "url");
check("uri", "text");

var successfullyParsed = true;

