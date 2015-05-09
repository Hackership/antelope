import React from "react"

import {Route} from "react-router"
import AppActions from "../actions/App"

import {InboxPage, EmailHandler, InboxMenuItem} from "../Components/Inbox"

export default function(){
    AppActions.addAppItem('routes',
                [<Route handler={InboxPage} name="inbox" path="/inbox" />,
                 <Route handler={EmailHandler} name="inboxEmail" path="/inbox/:docId" />])
    AppActions.addAppItem('menu',
        function() {return <InboxMenuItem />})
}