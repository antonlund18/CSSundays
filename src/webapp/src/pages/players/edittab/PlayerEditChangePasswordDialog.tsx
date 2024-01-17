import * as React from "react"
import {useContext, useEffect, useState} from "react"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tooltip, Typography} from "@mui/material";
import {useChangePasswordMutation, User} from "../../../codegen/generated-types";
import {ApolloError} from "@apollo/client";
import {Errors} from "../../../util/Errors";
import {SnackbarContext} from "../../../SnackbarContextProvider";
import {ErrorOutline} from "@mui/icons-material";
import {Strings} from "../../../util/Strings";

type PlayerEditChangePasswordDialogProps = {
    player: User
    open: boolean
    setOpen: (open: boolean) => void
}

export const PlayerEditChangePasswordDialog = (props: PlayerEditChangePasswordDialogProps): JSX.Element => {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordRepeated, setNewPasswordRepeated] = useState("")
    const [changePassword] = useChangePasswordMutation()
    const [errors, setErrors] = useState<number[]>([])
    const {openSnackbar} = useContext(SnackbarContext)

    useEffect(() => {
        if (!props.open) {
            resetState()
        }
    }, [props.open])

    const resetState = () => {
        setCurrentPassword("")
        setNewPassword("")
        setNewPasswordRepeated("")
        setErrors([])
    }

    const handleSave = () => {
        setErrors([])

        if (!props.player.id) {
            setErrors(errors => [Errors.USER_NOT_FOUND])
            return
        }

        changePassword({
            variables: {
                userId: props.player.id,
                currentPassword,
                newPassword,
                newPasswordRepeated
            }
        }).then(() => {
            props.setOpen(false)
            openSnackbar("Kodeord ændret", "success")
        }).catch((e: ApolloError) => {
            const gqlErrors: number[] = e.graphQLErrors.map(error => error.extensions.errorCode as number)
            setErrors(errors => [...errors, ...gqlErrors])
            openSnackbar("Der skete en fejl ved skiftning af kodeord", "error")
        })
    }

    const incorrectPassword = errors.includes(Errors.INCORRECT_PASSWORD)
    const invalidPassword = errors.includes(Errors.INVALID_PASSWORD)
    const passwordsDoesNotMatch = errors.includes(Errors.PASSWORDS_NOT_MATCHING)

    return <Dialog open={props.open} onClose={() => props.setOpen(false)} keepMounted={false}>
        <DialogTitle sx={{borderBottom: "1px solid", borderColor: "divider"}}>
            Skift kodeord
        </DialogTitle>
        <DialogContent sx={{width: "400px", padding: "24px !important"}}>
            <Typography variant={"subtitle2"}>Nuværende kodeord</Typography>
            <TextField type={"password"}
                       value={currentPassword}
                       onChange={e => setCurrentPassword(e.target.value)}
                       fullWidth
                       error={incorrectPassword}
                       helperText={incorrectPassword ? "*Forkert kodeord" : " "}/>

            <div style={{display: "flex", alignItems: "center", marginTop: "8px"}}>
                <Typography variant={"subtitle2"}>Nyt kodeord</Typography>
                <Tooltip  title={<span style={{whiteSpace: "pre-wrap"}}>{Strings.PASSWORD_REQUIREMENTS}</span>} arrow placement={"right"}>
                    <ErrorOutline sx={{marginLeft: "4px", marginTop: "8px", verticalAlign: "middle", fontSize: "14px"}}/>
                </Tooltip>
            </div>
            <TextField type={"password"}
                       fullWidth
                       value={newPassword}
                       onChange={e => setNewPassword(e.target.value)}
                       error={invalidPassword || passwordsDoesNotMatch}
                       helperText={invalidPassword ? "*Ugyldigt kodeord" : " "}/>

            <Typography variant={"subtitle2"}>Gentag nyt kodeord</Typography>
            <TextField type={"password"}
                       fullWidth
                       value={newPasswordRepeated}
                       onChange={e => setNewPasswordRepeated(e.target.value)}
                       error={passwordsDoesNotMatch}
                       helperText={passwordsDoesNotMatch ? "*De to kodeord er ikke ens" : " "}/>
        </DialogContent>
        <DialogActions sx={{borderTop: "1px solid", borderColor: "divider"}}>
            <Button onClick={() => props.setOpen(false)}>Luk</Button>
            <Button variant={"contained"} onClick={handleSave}>Gem</Button>
        </DialogActions>
    </Dialog>
}