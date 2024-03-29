import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTournaments} from "../../../hooks/api/useTournament";
import {CenteredPage} from "../../../components/CenteredPage";
import {DatePicker, LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {Button, Grid, MenuItem, Select, TextareaAutosize, TextField, Theme, Tooltip, Typography} from "@mui/material";
import {Divider as CSDivider} from "../../../components/Divider";
import {makeStyles} from "@mui/styles";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import MarkdownView from 'react-showdown';
import {ObjectType, TournamentFormat} from "../../../codegen/generated-types";
import {useSharedTeamAndUser} from "../../../hooks/api/useSharedTeamAndUser";

interface StylesProps {
    picture: string
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    textLabel: {
        marginTop: theme.spacing(1),
    },
    nameInput: {
        transition: "border-color 2s ease-in-out",
    },
    textField: {
        width: "100%",
        borderRadius: "4px",
        backgroundColor: "white",
    },
    dateAndTimePicker: {
        backgroundColor: "white",
        borderRadius: "4px",
        width: "100%",
    },
    red: {
        "& .MuiInputBase-root": {
            "&.Mui-focused fieldset": {
                borderColor: "red",
            }
        }
    },
    green: {
        "& .MuiInputBase-root": {
            "&.Mui-focused fieldset": {
                borderColor: "#32ff1b",
            }
        }
    },
    error: {
        paddingTop: theme.spacing(2),
    },
    tournamentPicture: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        border: "1px solid #a9a9a9",
        borderRadius: "4px"
    },
    description: {
        resize: "none",
        borderRadius: "4px",
        width: "100%",
        maxHeight: "200px",
        flex: 1
    },
    descriptionPreview: {
        border: "1px solid #a9a9a9",
        borderRadius: "4px",
        height: "200px",
        width: "100%",
        overflow: "auto"
    },
    picture: props => ({
        height: "100%",
        width: "100%",
        cursor: "pointer",
        backgroundImage: "url(" + props.picture + ")",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
    }),
}))


type FormatTextMapType = {
    format: TournamentFormat
    text: string
}

const formatTextMap: FormatTextMapType[] = [
    {
        format: TournamentFormat.SingleElimination,
        text: "Single Elimination"
    }
]


export const AdminCreateTournamentPage = (): JSX.Element => {
    const navigate = useNavigate()
    const [name, setName] = useState<string>("");
    const [date, setDate] = useState<Date | null>(new Date(new Date().setHours(12, 0)))
    const [size, setSize] = useState<number>(16)
    const [description, setDescription] = useState<string>("")
    const [rules, setRules] = useState<string>("")
    const [format, setFormat] = useState<TournamentFormat>(formatTextMap[0].format)
    const [fileSelector, setFileSelector] = useState<HTMLInputElement | null>(null);
    const [fileReader, setFileReader] = useState<FileReader | null>(null);
    const classes = useStyles({picture: fileReader?.result + "" ?? ""});
    const {setAndUploadPicture} = useSharedTeamAndUser();

    const {createTournament} = useTournaments()

    useEffect(() => {
        const selector = document.createElement("input");
        selector.setAttribute("type", "file");
        selector.setAttribute("accept", "image/jpeg, image/png, image/jpg");
        selector.addEventListener("change", async () => {
            const file = selector?.files?.item(0)
            if (file) {
                const reader: FileReader = new FileReader()
                reader.readAsDataURL(file)
                reader.onloadend = () => {
                    setFileReader(reader)
                }
            }
        })
        setFileSelector(selector);
    }, [])


    const handleCreate = async () => {
        if (date) {
            createTournament(name, date.toISOString(), size, format, "", description, rules)
                .then((data) => {
                    const tournament = data?.data?.createTournament
                    if (tournament?.id) {
                        setAndUploadPicture(tournament.id, fileSelector, ObjectType.Tournament)
                    }
                })
                .then((data) => navigate("/admin/tournaments"))
        }
    }

    const handleChangeTournamentSize = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(e.target.value)
        if (newSize < 2 || newSize > 2048) {
            return;
        }
        setSize(newSize > size ? size * 2 : size / 2)
    }

    const handleFileSelect = () => {
        fileSelector?.click()
    }

    return <CenteredPage>
        <Grid container direction={"row"} spacing={2}>
            <Grid item xs={12}>
                <Typography variant={"h2"} color={"primary"}>Opret turnering</Typography>
                <CSDivider/>
            </Grid>

            <Grid item xs={6}>
                <Typography variant={"subtitle2"}>Turneringsnavn</Typography>
                <TextField variant={"outlined"}
                           value={name}
                           placeholder={"Turneringsnavn"}
                           className={classes.textField + " " + (name.length < 2 ? classes.red : classes.green)}
                           inputProps={{className: classes.nameInput + " " + (name.length < 2 ? classes.red : classes.green),}}
                           onChange={(e) => setName(e.target.value)}
                />

                <Typography variant={"subtitle2"} className={classes.textLabel}>Størrelse (antal hold)</Typography>
                <TextField variant={"outlined"}
                           value={size}
                           type={"number"}
                           placeholder={"Antal hold"}
                           className={classes.textField}
                           inputProps={{className: classes.nameInput}}
                           onKeyPress={e => e.preventDefault()}
                           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                               e.preventDefault();
                               handleChangeTournamentSize(e)
                           }}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Typography variant={"subtitle2"} className={classes.textLabel}>Dato</Typography>
                    <DatePicker className={classes.dateAndTimePicker} value={date} format={"yyyy-MM-dd"} disablePast
                                onChange={value => setDate(value)}/>

                    <Typography variant={"subtitle2"} className={classes.textLabel}>Starttidspunkt</Typography>
                    <TimePicker ampm={false} className={classes.dateAndTimePicker} value={date}
                                onChange={(value: Date | null) => setDate(value)}/>
                </LocalizationProvider>

                <Typography variant={"subtitle2"} className={classes.textLabel}>Format</Typography>
                <Select className={classes.textField} value={format}
                        onChange={(e) => setFormat(e.target.value as TournamentFormat)}
                        disabled>
                    {formatTextMap.map((format) => {
                        return <MenuItem value={format.format}>{format.text}</MenuItem>
                    })}
                </Select>
            </Grid>

            <Grid item xs={6}>
                <div className={classes.tournamentPicture}>
                    {!fileSelector?.files?.item(0) ? <>
                            <Typography variant={"h4"}>Intet billede valgt</Typography>
                            <Button variant={"outlined"} onClick={handleFileSelect}>Upload billede</Button>
                        </> :
                        <Tooltip title={"Upload nyt billede"} arrow>
                            <div className={classes.picture} onClick={handleFileSelect}/>
                        </Tooltip>
                    }
                </div>
            </Grid>

            <Grid item xs={6}>
                <Typography variant={"subtitle2"} className={classes.textLabel}>Beskrivelse</Typography>
                <TextareaAutosize minRows={20} className={classes.description} maxRows={20}
                                  onChange={(e) => setDescription(e.target.value)}/>
            </Grid>

            <Grid item xs={6}>
                <Typography variant={"subtitle2"} className={classes.textLabel}>Preview</Typography>
                <MarkdownView markdown={`${description}`} className={classes.descriptionPreview}
                              flavor={"github"}/>
            </Grid>

            <Grid item xs={6}>
                <Typography variant={"subtitle2"} className={classes.textLabel}>Regler</Typography>
                <TextareaAutosize minRows={20} className={classes.description} maxRows={20}
                                  onChange={(e) => setRules(e.target.value)}/>
            </Grid>

            <Grid item xs={6}>
                <Typography variant={"subtitle2"} className={classes.textLabel}>Preview</Typography>
                <MarkdownView markdown={`${rules}`} className={classes.descriptionPreview}
                              flavor={"github"}/>
            </Grid>

            <Grid item xs={12}>
                <Button fullWidth variant={"contained"} onClick={handleCreate}>Opret turnering</Button>
            </Grid>
        </Grid>
    </CenteredPage>
}