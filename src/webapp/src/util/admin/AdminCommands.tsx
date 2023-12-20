import * as React from "react"
import {useEffect, useState} from "react"
import {Autocomplete, Popover, TextField} from "@mui/material";
import {AdminCommandCreateMatch} from "./AdminChangePlayerName";

export const AdminCommands = (props: React.PropsWithChildren<any>) => {
    const [open, setOpen] = useState(false)
    const [commandSearch, setCommandSearch] = useState<string>("")
    const [currentMouseX, setCurrentMouseX] = useState<number>(0)
    const [currentMouseY, setCurrentMouseY] = useState<number>(0)
    const [anchorX, setAnchorX] = useState<number>(0)
    const [anchorY, setAnchorY] = useState<number>(0)
    const [activeElement, setActiveElement] = useState<JSX.Element | null>(null)

    const Commands = {
        createMatch: <AdminCommandCreateMatch/>
    }
    const possibleCommands = Object.keys(Commands)

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress)

        return () => {
            window.removeEventListener("keydown", handleKeyPress)
        }
    }, [currentMouseY, currentMouseX])

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
            setOpen(!open)
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

    const handleClose = () => {
        setCommandSearch("")
        setActiveElement(null)
        setOpen(false)
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
        <Popover open={open} onClose={handleClose} anchorReference={"anchorPosition"}
                 anchorPosition={{top: anchorY, left: anchorX}}>
            {activeElement === null ?
                <Autocomplete
                    renderInput={(params) => (
                        <TextField {...params}
                                   sx={{width: "400px"}}
                                   onKeyDown={e => handleCommandSelect(e)}
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
        </Popover>
    </div>
}