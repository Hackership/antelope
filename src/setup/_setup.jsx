import React from "react"
import {Route} from "react-router"

import AppActions from "../actions/App"

import inboxSetup from "./inbox";
import searchSetup from "./search";
import contactsSetup from "./contacts";
import invoiceSetup from "./invoices";
import sequencesSetup from "./sequences";

import {Meeeh} from "../Components/Antelope";

import _ from "underscore";

export default function(){
    _.each([

        inboxSetup,
        contactsSetup,
        searchSetup,
        invoiceSetup,
        sequencesSetup

    ], x => x())

    AppActions.addAppItem('routes',
        <Route handler={Meeeh} name="home" path="/" />)

}

