import React from "react"

import {Route} from "react-router"
import AppActions from "../actions/App"

import {ManageContactsButton} from "../Components/Contacts"

export default function(){
    // AppActions.addAppItem('routes',
    //             [<Route handler={InboxPage} name="inbox" path="/inbox" />,
                 // <Route handler={EmailHandler} name="inboxEmail" path="/inbox/:docId" />])
    AppActions.addAppItem('emailActions', ManageContactsButton)
}