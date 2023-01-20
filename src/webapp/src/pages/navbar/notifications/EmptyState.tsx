import {makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center"
    },
    image: {
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        opacity: "80%",
        marginTop: "40px",
        objectFit: "cover",
        objectPosition: "5% 0%"
    },
    headerText: {
        marginTop: "32px"
    }
})

export const EmptyState = (): JSX.Element => {
    const classes = useStyles();

    return <div className={classes.container}>
        <img className={classes.image}
             src={"https://img.freepik.com/free-vector/sunset-desert-with-road-cactuses-rocks_107791-1168.jpg?w=1380&t=st=1674250716~exp=1674251316~hmac=3cadbb5344571edd0d85102d6b4b136ad5b74f09756890bdf8b69e645f48a678"}/>
        <Typography variant={"subtitle1"} className={classes.headerText}>ingen notifikationer</Typography>
        <Typography variant={"body2"}>Vi giver dig besked,<br/>når der sker noget nyt.</Typography>
    </div>
}