import React from "react"

import {Route} from "react-router"
import {NavItemLink} from "react-router-bootstrap"
import AppActions from "../actions/App"

import {ContactsPage, ContactPage, ManageContactsButton} from "../Components/Contacts"

export default function(){
    AppActions.addAppItem('routes',
                [<Route handler={ContactsPage} name="contacts" path="/contacts" />,
                 <Route handler={ContactPage} name="contact" path="/contacts/:docId" />])
    AppActions.addAppItem('menu', () => <NavItemLink to="contacts">Contacts</NavItemLink>);
    // AppActions.addAppItem('emailActions', ManageContactsButton)
}