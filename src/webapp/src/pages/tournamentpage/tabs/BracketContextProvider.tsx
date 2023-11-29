import * as React from "react"
import {createContext, useEffect, useState} from "react"

export type BracketContextState = {
    numberOfRoundsToBeShown: number | null
    maxNumberOfRoundsToBeShown: number | null
    increaseNumberOfRoundsShown: () => void
    decreaseNumberOfRoundsShown: () => void
    setMaxNumberOfRoundsToBeShown: (rounds: number) => void
}

export const BracketContext = createContext<BracketContextState>({
    numberOfRoundsToBeShown: null,
    maxNumberOfRoundsToBeShown: null,
    increaseNumberOfRoundsShown: () => null,
    decreaseNumberOfRoundsShown: () => null,
    setMaxNumberOfRoundsToBeShown: () => null
})

export const BracketContextProvider = (props: React.PropsWithChildren<any>) => {
    const [numberOfRoundsToBeShown, setNumberOfRoundsToBeShown] = useState<number | null>(null)
    const [maxNumberOfRoundsToBeShown, setMaxNumberOfRoundsToBeShown] = useState<number | null>(null)

    useEffect(() => {
        setNumberOfRoundsToBeShown(maxNumberOfRoundsToBeShown)
    }, [maxNumberOfRoundsToBeShown])

    const increaseNumberOfRoundsShown = () => {
        if (numberOfRoundsToBeShown && maxNumberOfRoundsToBeShown && numberOfRoundsToBeShown < maxNumberOfRoundsToBeShown) {
            setNumberOfRoundsToBeShown(numberOfRoundsToBeShown + 1)
        }
    }

    const decreaseNumberOfRoundsShown = () => {
        if (numberOfRoundsToBeShown && maxNumberOfRoundsToBeShown && numberOfRoundsToBeShown > 1) {
            setNumberOfRoundsToBeShown(numberOfRoundsToBeShown - 1)
        }
    }

    const values = {
        numberOfRoundsToBeShown,
        maxNumberOfRoundsToBeShown,
        increaseNumberOfRoundsShown,
        decreaseNumberOfRoundsShown,
        setMaxNumberOfRoundsToBeShown
    }

    return <BracketContext.Provider value={values}>
        {props.children}
    </BracketContext.Provider>
}