import * as React from "react";

interface ConditionalWrapperProps {
    condition: boolean,
    wrapper: (children: React.ReactNode) => JSX.Element
}

export const ConditionalWrapper = (props: React.PropsWithChildren<ConditionalWrapperProps>): JSX.Element => {
    return props.condition ? props.wrapper(props.children) : <>{props.children}</>;
}