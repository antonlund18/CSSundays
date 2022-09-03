import * as React from "react";
import {Link} from "react-router-dom";
import {ConditionalWrapper} from "../../components/ConditionalWrapper";


type NavBarMenuItemWrapperProps = {
    link?: string
}

export const NavBarMenuItemWrapper = (props: React.PropsWithChildren<NavBarMenuItemWrapperProps>): JSX.Element => {
    const hasLink = !(props.link === undefined)

    return <ConditionalWrapper condition={hasLink} wrapper={() => <Link to={props.link ?? ""} style={{textDecoration: "none"}}>{props.children}</Link>}>
        {props.children}
    </ConditionalWrapper>
}