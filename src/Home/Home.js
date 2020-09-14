import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { default as StyledContainer } from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import RoomImgPath from "./assets/room.jpg";
import ProgrammingImgPath from "./assets/programming.jpg";

export default function Home(props) {
    return (
        <StyledContainer fixed style={{ marginTop: "100px" }}>
            <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
                <Grid item>
                    <Typography variant="h1" color="textPrimary" component="h1">
                        Caolo
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h3" color="textSecondary" component="h3">
                        Browser based strategy game
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid container justify="center" spacing={2}>
                        <Grid item>
                            <RecipeReviewCard route="room" title="Room" imagePath={RoomImgPath}></RecipeReviewCard>
                        </Grid>
                        <Grid item>
                            <RecipeReviewCard route="programming" title="Programming" imagePath={ProgrammingImgPath}></RecipeReviewCard>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </StyledContainer>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        minWidth: 345,
        "&:hover": {
            background: "gray",
        },
    },
    media: {
        height: 0,
        paddingTop: "56.25%", // 16:9
    },
}));

function RecipeReviewCard({ imagePath, title, route }) {
    const history = useHistory();
    const classes = useStyles();
    const [hovered, setHovered] = useState(false);

    return (
        <Card
            onClick={() => history.push(route)}
            className={classes.root}
            raised={true}
            elevation={hovered ? 10 : 3}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <CardHeader title={title} />
            <CardMedia className={classes.media} image={imagePath} />
        </Card>
    );
}
