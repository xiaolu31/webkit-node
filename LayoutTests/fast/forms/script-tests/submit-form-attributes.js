description('Tests the behavior of .formaction, .formenctype, .formmethod and .formtarget of HTMLInputElement and HTMLButtonElement.');

var input = document.createElement('input');

debug('Ordinary values for input:');
input.type = "submit";
shouldBe('input.formAction', '""');
shouldBe('input.formEnctype', '"application/x-www-form-urlencoded"');
shouldBe('input.formMethod', '"get"');
shouldBe('input.formTarget', '""');

input.setAttribute('formAction', 'http://localhost');
shouldBe('input.formAction', '"http://localhost/"');
input.setAttribute('formAction', 'http://localhost/');
shouldBe('input.formAction', '"http://localhost/"');
input.setAttribute('formEnctype', 'text/plain');
shouldBe('input.formEnctype', '"text/plain"');
input.setAttribute('formEnctype', 'na');
shouldBe('input.formEnctype', '"application/x-www-form-urlencoded"');
input.setAttribute('formMethod', 'GET');
shouldBe('input.formMethod', '"get"');
input.setAttribute('formMethod', 'ni');
shouldBe('input.formMethod', '"get"');
input.setAttribute('formTarget', '_blank');
shouldBe('input.formTarget', '"_blank"');
input.setAttribute('formTarget', 'nu');
shouldBe('input.formTarget', '"nu"');

input.formAction = 'http://example.com';
shouldBe('input.formAction', '"http://example.com/"');
input.formAction = 'http://example.com/';
shouldBe('input.formAction', '"http://example.com/"');
input.formEnctype = 'text/plain';
shouldBe('input.formEnctype', '"text/plain"');
input.formEnctype = 'nota';
shouldBe('input.formEnctype', '"application/x-www-form-urlencoded"');
input.formMethod = 'POST';
shouldBe('input.formMethod', '"post"');
input.formMethod = 'neta';
shouldBe('input.formMethod', '"get"');
input.formTarget = 'http://example.com';
shouldBe('input.formTarget', '"http://example.com"');
input.formTarget = 'nta';
shouldBe('input.formTarget', '"nta"');

debug('');
debug('Setting null for input:');
input.formEnctype = null;
shouldBe('input.formEnctype', '"application/x-www-form-urlencoded"');
shouldBe('input.getAttribute("formEnctype")', 'null');
input.setAttribute('formEnctype', null);
shouldBe('input.formEnctype', '"application/x-www-form-urlencoded"');
input.formMethod = null;
shouldBe('input.formMethod', '"get"');
shouldBe('input.getAttribute("formMethod")', 'null');
input.setAttribute('formMethod', null);
shouldBe('input.formMethod', '"get"');
input.formTarget = null;
shouldBe('input.formTarget', '""');
shouldBe('input.getAttribute("formTarget")', 'null');
input.setAttribute('formTarget', null);
shouldBe('input.formTarget', '"null"');

debug('');
debug('Setting undefined for input:');
input.formEnctype = undefined;
shouldBe('input.formEnctype', '"application/x-www-form-urlencoded"');
shouldBe('input.getAttribute("formEnctype")', '"undefined"');
input.setAttribute('formEnctype', undefined);
shouldBe('input.formEnctype', '"application/x-www-form-urlencoded"');
input.formMethod = undefined;
shouldBe('input.formMethod', '"get"');
shouldBe('input.getAttribute("formMethod")', '"undefined"');
input.setAttribute('formMethod', undefined);
shouldBe('input.formMethod', '"get"');
input.formTarget = undefined;
shouldBe('input.formTarget', '"undefined"');
shouldBe('input.getAttribute("formTarget")', '"undefined"');
input.setAttribute('formTarget', undefined);
shouldBe('input.formTarget', '"undefined"');

debug('');
debug('Setting non-string for input:');
input.formEnctype = 256;
shouldBe('input.formEnctype', '"application/x-www-form-urlencoded"');
shouldBe('input.getAttribute("formEnctype")', '"256"');
input.setAttribute('formEnctype', 256);
shouldBe('input.formEnctype', '"application/x-www-form-urlencoded"');
input.formMethod = 256;
shouldBe('input.formMethod', '"get"');
shouldBe('input.getAttribute("formMethod")', '"256"');
input.setAttribute('formMethod', 256);
shouldBe('input.formMethod', '"get"');
input.formTarget = 256;
shouldBe('input.formTarget', '"256"');
shouldBe('input.getAttribute("formTarget")', '"256"');
input.setAttribute('formTarget', 256);
shouldBe('input.formTarget', '"256"');

var button = document.createElement('button');
debug('');
debug('Ordinary values for button:');
button.type = "submit";
shouldBe('button.formAction', '""');
shouldBe('button.formEnctype', '"application/x-www-form-urlencoded"');
shouldBe('button.formMethod', '"get"');
shouldBe('button.formTarget', '""');

button.setAttribute('formAction', 'http://localhost');
shouldBe('button.formAction', '"http://localhost/"');
button.setAttribute('formAction', 'http://localhost/');
shouldBe('button.formAction', '"http://localhost/"');
button.setAttribute('formEnctype', 'text/plain');
shouldBe('button.formEnctype', '"text/plain"');
button.setAttribute('formEnctype', 'na');
shouldBe('button.formEnctype', '"application/x-www-form-urlencoded"');
button.setAttribute('formMethod', 'GET');
shouldBe('button.formMethod', '"get"');
button.setAttribute('formMethod', 'na');
shouldBe('button.formMethod', '"get"');
button.setAttribute('formTarget', '_blank');
shouldBe('button.formTarget', '"_blank"');
button.setAttribute('formTarget', 'na');
shouldBe('button.formTarget', '"na"');

button.formAction = 'http://example.com';
shouldBe('button.formAction', '"http://example.com/"');
button.formAction = 'http://example.com/';
shouldBe('button.formAction', '"http://example.com/"');
button.formEnctype = 'text/plain';
shouldBe('button.formEnctype', '"text/plain"');
button.formEnctype = 'nota';
shouldBe('button.formEnctype', '"application/x-www-form-urlencoded"');
button.formMethod = 'POST';
shouldBe('button.formMethod', '"post"');
button.formMethod = 'nota';
shouldBe('button.formMethod', '"get"');
button.formTarget = 'http://example.com';
shouldBe('button.formTarget', '"http://example.com"');
button.formTarget = 'nota';
shouldBe('button.formTarget', '"nota"');

debug('');
debug('Setting null for button:');
button.formEnctype = null;
shouldBe('button.formEnctype', '"application/x-www-form-urlencoded"');
shouldBe('button.getAttribute("formEnctype")', 'null');
button.setAttribute('formEnctype', null);
shouldBe('button.formEnctype', '"application/x-www-form-urlencoded"');
button.formMethod = null;
shouldBe('button.formMethod', '"get"');
shouldBe('button.getAttribute("formMethod")', 'null');
button.setAttribute('formMethod', null);
shouldBe('button.formMethod', '"get"');
button.formTarget = null;
shouldBe('button.formTarget', '""');
shouldBe('button.getAttribute("formTarget")', 'null');
button.setAttribute('formTarget', null);
shouldBe('button.formTarget', '"null"');

debug('');
debug('Setting undefined for button:');
button.formEnctype = undefined;
shouldBe('button.formEnctype', '"application/x-www-form-urlencoded"');
shouldBe('button.getAttribute("formEnctype")', '"undefined"');
button.setAttribute('formEnctype', undefined);
shouldBe('button.formEnctype', '"application/x-www-form-urlencoded"');
button.formMethod = undefined;
shouldBe('button.formMethod', '"get"');
shouldBe('button.getAttribute("formMethod")', '"undefined"');
button.setAttribute('formMethod', undefined);
shouldBe('button.formMethod', '"get"');
button.formTarget = undefined;
shouldBe('button.formTarget', '"undefined"');
shouldBe('button.getAttribute("formTarget")', '"undefined"');
button.setAttribute('formTarget', undefined);
shouldBe('button.formTarget', '"undefined"');

debug('');
debug('Setting non-string for button:');
button.formEnctype = 256;
shouldBe('button.formEnctype', '"application/x-www-form-urlencoded"');
shouldBe('button.getAttribute("formEnctype")', '"256"');
button.setAttribute('formEnctype', 512);
shouldBe('button.formEnctype', '"application/x-www-form-urlencoded"');
button.formMethod = 128;
shouldBe('button.formMethod', '"get"');
shouldBe('button.getAttribute("formMethod")', '"128"');
button.setAttribute('formMethod', 17);
shouldBe('button.formMethod', '"get"');
button.formTarget = 100;
shouldBe('button.formTarget', '"100"');
shouldBe('button.getAttribute("formTarget")', '"100"');
button.setAttribute('formTarget', 281);
shouldBe('button.formTarget', '"281"');

var successfullyParsed = true;
