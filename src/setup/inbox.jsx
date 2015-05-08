import React from "react"

import {Route} from "react-router"
import AppActions from "../actions/App"

import {InboxPage, InboxMenuItem} from "../Components/Inbox"

export default function(){
    AppActions.addRoute(<Route handler={InboxPage} name="inbox" path="/inbox" />)
    AppActions.addMenuItem(function() {return <InboxMenuItem />})
}