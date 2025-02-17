/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
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

#include "config.h"

#include "WebCompositorImpl.h"

#include "cc/CCProxy.h"

#include <gtest/gtest.h>
#include <wtf/OwnPtr.h>

using WebKit::WebCompositor;
using WebKit::WebCompositorImpl;

namespace {

TEST(WebCompositorImpl, fromIdentifier)
{
#ifndef NDEBUG
    // WebCompositor APIs can only be called from the compositor thread.
    WebCore::CCProxy::setImplThread(true);
#endif

    // Before creating any WebCompositors, lookups for any value should fail and not crash.
    EXPECT_EQ(0, WebCompositor::fromIdentifier(2));
    EXPECT_EQ(0, WebCompositor::fromIdentifier(0));
    EXPECT_EQ(0, WebCompositor::fromIdentifier(-1));

    int compositorIdentifier = -1;
    {
#ifndef NDEBUG
        WebCore::CCProxy::setImplThread(false);
#endif
        OwnPtr<WebCompositorImpl> comp = WebCompositorImpl::create();
#ifndef NDEBUG
        WebCore::CCProxy::setImplThread(true);
#endif
        compositorIdentifier = comp->identifier();
        // The compositor we just created should be locatable.
        EXPECT_EQ(comp.get(), WebCompositor::fromIdentifier(compositorIdentifier));

        // But nothing else.
        EXPECT_EQ(0, WebCompositor::fromIdentifier(comp->identifier() + 10));
    }

    // After the compositor is destroyed, its entry should be removed from the map.
    EXPECT_EQ(0, WebCompositor::fromIdentifier(compositorIdentifier));
}

}
