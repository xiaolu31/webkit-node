/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 * Copyright (C) 2009 Joseph Pecoraro
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
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
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

/**
 * @constructor
 */
WebInspector.Drawer = function()
{
    this.element = document.getElementById("drawer");
    this._savedHeight = 200; // Default.
    this._mainElement = document.getElementById("main");
    this._toolbarElement = document.getElementById("toolbar");
    this._mainStatusBar = document.getElementById("main-status-bar");
    this._mainStatusBar.addEventListener("mousedown", this._startStatusBarDragging.bind(this), true);
    this._counters = document.getElementById("counters");
    this._drawerStatusBar = document.createElement("div");
    this._drawerStatusBar.id = "drawer-status-bar";
    this._drawerStatusBar.className = "status-bar";
    this.element.appendChild(this._drawerStatusBar);

    this._viewStatusBar = document.createElement("div");
    this._drawerStatusBar.appendChild(this._viewStatusBar);
}

WebInspector.Drawer.prototype = {
    get visible()
    {
        return !!this._view;
    },

    _constrainHeight: function(height)
    {
        return Number.constrain(height, Preferences.minConsoleHeight, window.innerHeight - this._mainElement.totalOffsetTop() - Preferences.minConsoleHeight);
    },

    show: function(view, immediately)
    {
        this.immediatelyFinishAnimation();

        var drawerWasVisible = this.visible;
        
        if (this._view)
            this.element.removeChild(this._view.element);

        this._view = view;

        var statusBarItems = this._view.statusBarItems || [];
        for (var i = 0; i < statusBarItems.length; ++i)
            this._viewStatusBar.appendChild(statusBarItems[i]);

        if (drawerWasVisible)
            return;

        document.body.addStyleClass("drawer-visible");

        this._view.show(this.element);

        var anchoredItems = document.getElementById("anchored-status-bar-items");
        var height = this._constrainHeight(this._savedHeight || this.element.offsetHeight);
        var animations = [
            {element: this.element, end: {height: height}},
            {element: this._mainElement, end: {bottom: height}},
            {element: this._mainStatusBar, start: {"padding-left": anchoredItems.offsetWidth - 1}, end: {"padding-left": 0}},
            {element: this._viewStatusBar, start: {opacity: 0}, end: {opacity: 1}}
        ];

        this._drawerStatusBar.insertBefore(anchoredItems, this._drawerStatusBar.firstChild);

        if (this._currentPanelCounters) {
            var oldRight = this._drawerStatusBar.clientWidth - (this._counters.offsetLeft + this._currentPanelCounters.offsetWidth);
            var newRight = WebInspector.Panel.counterRightMargin;
            var rightPadding = (oldRight - newRight);
            animations.push({element: this._currentPanelCounters, start: {"padding-right": rightPadding}, end: {"padding-right": 0}});
            this._currentPanelCounters.parentNode.removeChild(this._currentPanelCounters);
            this._mainStatusBar.appendChild(this._currentPanelCounters);
        }

        function animationFinished()
        {
            WebInspector.currentPanel().statusBarResized();
            if (this._view && this._view.afterShow)
                this._view.afterShow();
            delete this._currentAnimation;
            if (this._currentPanelCounters)
                this._currentPanelCounters.removeAttribute("style");
        }

        this._currentAnimation = WebInspector.animateStyle(animations, this._animationDuration(), animationFinished.bind(this));
        if (immediately)
            this._currentAnimation.forceComplete();
    },

    hide: function(immediately)
    {
        this.immediatelyFinishAnimation();
        if (!this.visible)
            return;

        this._savedHeight = this.element.offsetHeight;

        if (this.element === WebInspector.currentFocusElement || this.element.isAncestor(WebInspector.currentFocusElement))
            WebInspector.currentFocusElement = WebInspector.previousFocusElement;

        var anchoredItems = document.getElementById("anchored-status-bar-items");

        // Temporarily set properties and classes to mimic the post-animation values so panels
        // like Elements in their updateStatusBarItems call will size things to fit the final location.
        this._mainStatusBar.style.setProperty("padding-left", (anchoredItems.offsetWidth - 1) + "px");
        document.body.removeStyleClass("drawer-visible");
        WebInspector.currentPanel().statusBarResized();
        document.body.addStyleClass("drawer-visible");

        var animations = [
            {element: this._mainElement, end: {bottom: 0}},
            {element: this._mainStatusBar, start: {"padding-left": 0}, end: {"padding-left": anchoredItems.offsetWidth - 1}},
            {element: this._viewStatusBar, start: {opacity: 1}, end: {opacity: 0}}
        ];

        if (this._currentPanelCounters) {
            var newRight = this._drawerStatusBar.clientWidth - this._counters.offsetLeft;
            var oldRight = this._mainStatusBar.clientWidth - (this._currentPanelCounters.offsetLeft + this._currentPanelCounters.offsetWidth);
            var rightPadding = (newRight - oldRight);
            animations.push({element: this._currentPanelCounters, start: {"padding-right": 0}, end: {"padding-right": rightPadding}});
        }

        function animationFinished()
        {
            WebInspector.currentPanel().doResize();
            this._mainStatusBar.insertBefore(anchoredItems, this._mainStatusBar.firstChild);
            this._mainStatusBar.style.removeProperty("padding-left");

            if (this._currentPanelCounters) {
                this._currentPanelCounters.setAttribute("style", null);
                this._currentPanelCounters.parentNode.removeChild(this._currentPanelCounters);
                this._counters.insertBefore(this._currentPanelCounters, this._counters.firstChild);
            }

            this._view.hide();
            this.element.removeChild(this._view.element);
            delete this._view;
            document.body.removeStyleClass("drawer-visible");
            delete this._currentAnimation;
        }

        this._currentAnimation = WebInspector.animateStyle(animations, this._animationDuration(), animationFinished.bind(this));
        if (immediately)
            this._currentAnimation.forceComplete();
    },

    resize: function()
    {
        if (!this.visible)
            return;

        this._view.storeScrollPositions();
        var height = this._constrainHeight(parseInt(this.element.style.height, 10));
        this._mainElement.style.bottom = height + "px";
        this.element.style.height = height + "px";
        this._view.doResize();
    },

    immediatelyFinishAnimation: function()
    {
        if (this._currentAnimation)
            this._currentAnimation.forceComplete();
    },

    set currentPanelCounters(x)
    {
        if (!x) {
            if (this._currentPanelCounters)
                this._currentPanelCounters.parentElement.removeChild(this._currentPanelCounters);
            delete this._currentPanelCounters;
            return;
        }

        this._currentPanelCounters = x;
        if (this.visible)
            this._mainStatusBar.appendChild(x);
        else
            this._counters.insertBefore(x, this._counters.firstChild);
    },

    _animationDuration: function()
    {
        return (window.event && window.event.shiftKey ? 2000 : 250);
    },

    _safelyRemoveChildren: function()
    {
        var child = this.element.firstChild;
        while (child) {
            if (child.id !== "drawer-status-bar") {
                var moveTo = child.nextSibling;
                this.element.removeChild(child);
                child = moveTo;
            } else
                child = child.nextSibling;
        }
    },

    _startStatusBarDragging: function(event)
    {
        if (!this.visible || event.target !== this._mainStatusBar)
            return;

        this._view.storeScrollPositions();
        WebInspector.elementDragStart(this._mainStatusBar, this._statusBarDragging.bind(this), this._endStatusBarDragging.bind(this), event, "row-resize");

        this._statusBarDragOffset = event.pageY - this.element.totalOffsetTop();

        event.stopPropagation();
    },

    _statusBarDragging: function(event)
    {
        var height = window.innerHeight - event.pageY + this._statusBarDragOffset;
        height = Number.constrain(height, Preferences.minConsoleHeight, window.innerHeight - this._mainElement.totalOffsetTop() - Preferences.minConsoleHeight);

        this._mainElement.style.bottom = height + "px";
        this.element.style.height = height + "px";
        if (WebInspector.currentPanel())
            WebInspector.currentPanel().doResize();
        this._view.doResize();

        event.preventDefault();
        event.stopPropagation();
    },

    _endStatusBarDragging: function(event)
    {
        WebInspector.elementDragEnd(event);

        this._savedHeight = this.element.offsetHeight;
        delete this._statusBarDragOffset;

        event.stopPropagation();
    }
}
