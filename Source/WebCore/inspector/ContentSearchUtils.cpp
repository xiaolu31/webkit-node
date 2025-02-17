/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY GOOGLE INC. AND ITS CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GOOGLE INC.
 * OR ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#include "config.h"
#include "ContentSearchUtils.h"

#if ENABLE(INSPECTOR)

#include "InspectorValues.h"
#include "RegularExpression.h"

using namespace std;

namespace WebCore {
namespace ContentSearchUtils {

namespace {
// This should be kept the same as the one in front-end/utilities.js
static const char regexSpecialCharacters[] = "[](){}+-*.,?\\^$|";
}

static String createSearchRegexSource(const String& text)
{
    String result;
    const UChar* characters = text.characters();
    String specials(regexSpecialCharacters);

    for (unsigned i = 0; i < text.length(); i++) {
        if (specials.find(characters[i]) != notFound)
            result.append("\\");
        result.append(characters[i]);
    }

    return result;
}

static Vector<pair<int, String> > getRegularExpressionMatchesByLines(const RegularExpression& regex, const String& text)
{
    Vector<pair<int, String> > result;

    int lineNumber = 0;
    unsigned start = 0;
    while (start < text.length()) {
        size_t lineEnd = text.find('\n', start);
        if (lineEnd == notFound)
            lineEnd = text.length();
        else
            lineEnd++;

        String line = text.substring(start, lineEnd - start);
        if (line.endsWith("\r\n"))
            line = line.left(line.length() - 2);
        if (line.endsWith("\n"))
            line = line.left(line.length() - 1);

        int matchLength;
        if (regex.match(line, 0, &matchLength) != -1)
            result.append(pair<int, String>(lineNumber, line));

        start = lineEnd;
        lineNumber++;
    }
    return result;
}

static PassRefPtr<InspectorObject> buildObjectForSearchMatch(int lineNumber, String lineContent)
{
    RefPtr<InspectorObject> result = InspectorObject::create();
    result->setNumber("lineNumber", lineNumber);
    result->setString("lineContent", lineContent);

    return result;
}

RegularExpression createSearchRegex(const String& text, bool caseSensitive, bool isRegex)
{
    String regexSource = isRegex ? text : createSearchRegexSource(text);
    return RegularExpression(regexSource, caseSensitive ? TextCaseSensitive : TextCaseInsensitive);
}

int countRegularExpressionMatches(const RegularExpression& regex, const String& content)
{
    int result = 0;
    int position;
    unsigned start = 0;
    int matchLength;
    while ((position = regex.match(content, start, &matchLength)) != -1) {
        if (start >= content.length())
            break;
        if (matchLength > 0)
            ++result;
        start = position + 1;
    }
    return result;
}

PassRefPtr<InspectorArray> searchInTextByLines(const String& query, const String& text)
{
    RefPtr<InspectorArray> result = InspectorArray::create();

    RegularExpression regex = ContentSearchUtils::createSearchRegex(query, false, false);
    Vector<pair<int, String> > matches = getRegularExpressionMatchesByLines(regex, text);

    for (Vector<pair<int, String> >::const_iterator it = matches.begin(); it != matches.end(); ++it)
        result->pushValue(buildObjectForSearchMatch(it->first, it->second));

    return result;
}

} // namespace ContentSearchUtils
} // namespace WebCore

#endif // ENABLE(INSPECTOR)
