/*
 * Copyright (C) 2010 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#ifndef OptionsObject_h
#define OptionsObject_h

#include "PlatformString.h"
#include "ScriptValue.h"
#include <v8.h>

namespace WebCore {

class DOMStringList;
class IDBKeyRange;

class OptionsObject {
public:
    OptionsObject();
    OptionsObject(const v8::Local<v8::Value>& options);
    ~OptionsObject();

    OptionsObject& operator=(const OptionsObject&);

    bool isUndefinedOrNull() const;
    bool getKeyBool(const String& key, bool& value) const;
    bool getKeyInt32(const String& key, int32_t& value) const;
    bool getKeyDouble(const String& key, double& value) const;
    bool getKeyString(const String& key, String& value) const;
    bool getKeyStringWithUndefinedOrNullCheck(const String& key, String& value) const;
    PassRefPtr<DOMStringList> getKeyDOMStringList(const String& key) const;
    PassRefPtr<IDBKeyRange> getKeyKeyRange(const String& key) const;

    bool getKeyValue(const String& key, bool& value) const
    {
        return getKeyBool(key, value);
    }
    bool getKeyValue(const String& key, int32_t& value) const
    {
        return getKeyInt32(key, value);
    }
    bool getKeyValue(const String& key, double& value) const
    {
        return getKeyDouble(key, value);
    }
    bool getKeyValue(const String& key, String& value) const
    {
        return getKeyString(key, value);
    }
    bool getKeyValue(const String& key, ScriptValue& value) const
    {
        v8::Local<v8::Value> v8Value;
        if (!getKey(key, v8Value))
            return false;

        value = ScriptValue(v8Value);
        return true;
    }
    bool getKeyValue(const String&, unsigned short&) const;
    bool getKeyValue(const String&, unsigned&) const;
    bool getKeyValue(const String&, unsigned long long&) const;

private:
    bool getKey(const String& key, v8::Local<v8::Value>&) const;

    // This object can only be used safely when stack allocated because of v8::Local.
    static void* operator new(size_t);
    static void* operator new[](size_t);
    static void operator delete(void *);

    v8::Local<v8::Value> m_options;
};

}

#endif // OptionsObject_h
