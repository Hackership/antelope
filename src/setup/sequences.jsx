
import React from "react"
import {Route} from "react-router"
import {MenuItemLink} from "react-router-bootstrap"
import AppActions from "../actions/App"

import Sequences from "../Components/Sequences"


export default function(){
    AppActions.addAppItem('routes',
        <Route handler={Sequences} name="sequences" path="/sequences" />)
    AppActions.addAppItem('tools',
        function() {return <MenuItemLink eventKey='2' to="sequences">Sequences</MenuItemLink>})
}