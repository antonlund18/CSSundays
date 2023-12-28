import * as React from "react"
import {useEffect, useRef, useState} from "react"
import {Autocomplete, TextField} from "@mui/material";
import {AdminCommandCreateTestMatch} from "./AdminChangeCreateTestMatch";
import {AdminCommandChangeMatchPhase} from "./AdminCommandChangeMatchPhase";
import {AdminCommandCreateTestData} from "./AdminCommandCreateTestData";


export const AdminCommands = (props: React.PropsWithChildren<any>) => {
    const [open, setOpen] = useState(false)
    const [commandSearch, setCommandSearch] = useState<string>("")
    const [currentMouseX, setCurrentMouseX] = useState<number>(0)
    const [currentMouseY, setCurrentMouseY] = useState<number>(0)
    const [anchorX, setAnchorX] = useState<number>(0)
    const [anchorY, setAnchorY] = useState<number>(0)
    const [activeElement, setActiveElement] = useState<JSX.Element | null>(null)
    const inputRef = useRef<HTMLInputElement>()

    const Commands = {
        createTestMatch: <AdminCommandCreateTestMatch/>,
        changeMatchPhase: <AdminCommandChangeMatchPhase/>,
        createTestData: <AdminCommandCreateTestData/>
    }
    const possibleCommands = Object.keys(Commands)

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress)

        return () => {
            window.removeEventListener("keydown", handleKeyPress)
        }
    }, [currentMouseY, currentMouseX, open])

    useEffect(() => {
        if (open && inputRef) {
            inputRef.current?.focus()
        }
    }, [open, inputRef])

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
            setOpen(!open)
            setActiveElement(null)
            setAnchorX(currentMouseX)
            setAnchorY(currentMouseY)
            setCommandSearch("")
            e.preventDefault()
            e.stopPropagation()
        }
    }

    const updateCursor = (e: React.MouseEvent) => {
        setCurrentMouseX(e.clientX)
        setCurrentMouseY(e.clientY)
    }

    const handleCommandSelect = (e: React.KeyboardEvent) => {
        if (e.code === 'Enter' && commandSearch) {
            const command = possibleCommands.find(command => command === commandSearch)
            Object.entries(Commands).forEach(entry => {
                if (entry[0] === command) {
                    setActiveElement(entry[1])
                }
            })
        }
    }

    return <div onMouseMove={updateCursor}>
        {props.children}
        <div style={{display: open ? "block" : "none", position: "absolute", top: anchorY, left: anchorX, backgroundColor: "white", borderRadius: "4px", zIndex: 9999}}>
            {activeElement === null ?
                <Autocomplete
                    renderInput={(params) => (
                        <TextField {...params}
                                   sx={{width: "400px"}}
                                   onKeyDown={e => handleCommandSelect(e)}
                                   focused
                                   inputRef={inputRef}
                                   autoFocus/>)}
                    inputValue={commandSearch}
                    onInputChange={(event, newSearch) => setCommandSearch(newSearch)}
                    options={possibleCommands}
                    autoComplete
                    freeSolo
                    disableClearable
                    disableCloseOnSelect
                    onKeyDown={e => {
                        if (e.code === "Escape") {
                            setCommandSearch("")
                        }
                    }}
                /> : activeElement}
        </div>
    </div>
}