/*
    Copyright (C) 2009 Igalia S.L.
    Copyright (C) 2011 Samsung Electronics

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Library General Public
    License as published by the Free Software Foundation; either
    version 2 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Library General Public License for more details.

    You should have received a copy of the GNU Library General Public License
    along with this library; see the file COPYING.LIB.  If not, write to
    the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
    Boston, MA 02110-1301, USA.
*/

#include "config.h"
#include "ewk_auth_soup.h"

#include "EWebKit.h"
#include "ewk_auth.h"
#include "ewk_logging.h"
#include <glib-object.h>
#include <glib.h>
#include <libsoup/soup.h>

#ifdef __cplusplus
extern "C" {
#endif

/**
 * #Ewk_Soup_Auth_Dialog is a #SoupSessionFeature that you can attach to your
 * #SoupSession to provide a simple authentication dialog while
 * handling HTTP basic auth. It is built as a simple C-only module
 * to ease reuse.
 */

typedef struct _Ewk_Auth_Data {
    SoupMessage* msg;
    SoupAuth* auth;
    SoupSession* session;
} Ewk_Auth_Data;

static Ewk_Auth_Show_Dialog_Callback ewk_auth_show_dialog_callback = 0;

static void ewk_auth_soup_dialog_session_feature_init(SoupSessionFeatureInterface*, gpointer);
static void attach(SoupSessionFeature*, SoupSession*);
static void detach(SoupSessionFeature*, SoupSession*);
static void free_auth_data(Ewk_Auth_Data*);

G_DEFINE_TYPE_WITH_CODE(Ewk_Soup_Auth_Dialog, ewk_auth_soup_dialog, G_TYPE_OBJECT,
                        G_IMPLEMENT_INTERFACE(SOUP_TYPE_SESSION_FEATURE, ewk_auth_soup_dialog_session_feature_init))

static void ewk_auth_soup_dialog_class_init(Ewk_Soup_Auth_DialogClass* klass)
{
}

static void ewk_auth_soup_dialog_init(Ewk_Soup_Auth_Dialog* instance)
{
}

static void ewk_auth_soup_dialog_session_feature_init(SoupSessionFeatureInterface* feature_interface, gpointer interface_data)
{
    feature_interface->attach = attach;
    feature_interface->detach = detach;
}

void ewk_auth_soup_show_dialog_callback_set(Ewk_Auth_Show_Dialog_Callback callback)
{
    ewk_auth_show_dialog_callback = callback;
}

void ewk_auth_soup_credentials_set(const char* username, const char* password, void* data)
{
    if (!data)
        return;

    Ewk_Auth_Data* auth_data = static_cast<Ewk_Auth_Data*>(data);
    soup_auth_authenticate(auth_data->auth, username, password);
    soup_session_unpause_message(auth_data->session, auth_data->msg);
    free_auth_data(auth_data);
}

static void session_authenticate(SoupSession* session, SoupMessage* msg, SoupAuth* auth, gboolean retrying, gpointer /* user_data */)
{
    SoupURI* uri;
    Ewk_Auth_Data* auth_data;
    const char* realm;

    if (!ewk_auth_show_dialog_callback)
        return;

    auth_data = static_cast<Ewk_Auth_Data*>(calloc(1, sizeof(Ewk_Auth_Data)));

    if (!auth_data) {
        CRITICAL("could not allocate Ewk_Auth_Data");
        return;
    }

    soup_session_pause_message(session, msg);
    // We need to make sure the message sticks around when pausing it.
    g_object_ref(msg);
    g_object_ref(session);
    g_object_ref(auth);

    auth_data->msg = msg;
    auth_data->auth = auth;
    auth_data->session = session;

    uri = soup_message_get_uri(auth_data->msg);
    realm = soup_auth_get_realm(auth_data->auth);

    // Call application method responsible for showing authentication dialog and sending back authorization data.
    ewk_auth_show_dialog_callback(realm, soup_uri_to_string(uri, TRUE), auth_data);
}

static void free_auth_data(Ewk_Auth_Data* auth_data)
{
    g_object_unref(auth_data->msg);
    g_object_unref(auth_data->session);
    g_object_unref(auth_data->auth);
    free(auth_data);
}

static void attach(SoupSessionFeature* manager, SoupSession* session)
{
    g_signal_connect(session, "authenticate", G_CALLBACK(session_authenticate), manager);
}

static void detach(SoupSessionFeature* manager, SoupSession* session)
{
    g_signal_handlers_disconnect_by_func(session, (void*)session_authenticate, manager);
}

#ifdef __cplusplus
}
#endif
