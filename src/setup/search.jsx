
import React from "react"
import {Route} from "react-router"
import {MenuItemLink} from "react-router-bootstrap"
import AppActions from "../actions/App"

import FindAttachment from "../Components/FindAttachments"


export default function(){
    AppActions.addAppItem('routes',
        <Route handler={FindAttachment} name="attachments" path="/search" />)
    AppActions.addAppItem('tools',
        function() {return <MenuItemLink eventKey='1' to="attachments">Attachments search</MenuItemLink>})
}