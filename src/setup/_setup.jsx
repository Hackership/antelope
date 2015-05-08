import React from "react"
import {Route} from "react-router"

import AppActions from "../actions/App"

import inboxSetup from "./inbox";
import searchSetup from "./search";

import {Meeeh} from "../Components/Antelope";

import _ from "underscore";

export default function(){
    _.each([

        inboxSetup,
        searchSetup

    ], x => x())

    AppActions.addRoute(<Route handler={Meeeh} name="home" path="/" />)

}

