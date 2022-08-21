import React, { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormHelperText from "@mui/material/FormHelperText";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { TextField } from "@mui/material";

const theme = createTheme();

export default function Home() {
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [ads, setAds] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selected, setSelected] = useState(0);
    const [filtered, setFiltered] = useState([]);
    const open = Boolean(anchorEl);
    const [display, setDisplay] = useState(false);
    const [titleError, setTitleError] = useState("");
    const [descError, setDescError] = useState("");
    const [priceError, setPriceError] = useState("");
    const [categoryError, setCategoryError] = useState("");

    const handleClickOpen = () => {
        setDisplay(true);
    };

    const handleClickClose = () => {
        setDisplay(false);
        setTitleError("");
        setDescError("");
        setPriceError("");
        setCategoryError("");
    };

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelected(index);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:8000/category");
            const data = await response.json();
            setCategories([{ name: "All" }].concat(data));
        } catch (error) {
            console.log(error.message);
        }
    };

    const fetchAds = async () => {
        try {
            const response = await fetch("http://localhost:8000/ads");
            const data = await response.json();
            setAds(data);
            setFiltered(data);
            console.log(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const submitAd = async (input) => {
        try {
            const response = await fetch("http://localhost:8000/ads", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });
            const data = await response.json();
            if (response.status !== 201) {
                alert(data.message);
                return;
            } else {
                alert(data.message);
                handleClickClose();
                return;
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const title = data.get("title");
        const description = data.get("description");
        const price = data.get("price");
        const category = data.get("category");
        const seller = user.id;
        console.log(title, description, price, category, seller);

        if (title.length < 6) {
            setTitleError("Title must be at least 6 characters long");
            return;
        } else {
            setTitleError("");
        }

        if (description.length < 6) {
            setDescError("Description must be at least 6 characters long");
            return;
        } else {
            setDescError("");
        }

        if (price < 1) {
            setPriceError("Price must be higher than 0");
        } else {
            setPriceError("");
        }

        if (category === null) {
            setCategoryError("Category must be selected");
        } else {
            setCategoryError("");
            if (!titleError && !descError && !priceError)
                return submitAd({
                    title,
                    description,
                    price,
                    seller,
                    category,
                });
        }

        if (!titleError && !descError && !priceError && !categoryError)
            return submitAd({ title, description, price, seller, category });
    };

    useEffect(() => {
        if (selected !== 0) {
            setFiltered(
                ads.filter((el) => categories[selected].name === el.category)
            );
        } else {
            setFiltered(ads);
        }
        // eslint-disable-next-line
    }, [selected]);

    useEffect(() => {
        const data = localStorage.getItem("userDetails");
        if (data !== null) {
            setUser(JSON.parse(data));
        }
        fetchCategories();
        fetchAds();
        // eslint-disable-next-line
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container
                maxWidth="md"
                sx={{ minHeight: "90vh", pt: "20px", pb: "20px" }}
            >
                <Typography
                    variant="h3"
                    align="center"
                    color="text.primary"
                    mt="20px"
                    gutterBottom
                >
                    DummyBuy Adverts
                </Typography>

                <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                    ml="30px"
                    mr="30px"
                    gutterBottom
                >
                    Whether you sell online, on social media, in store, or out
                    of the trunk of your car, DummyBuy has you covered in
                    letting world know about it.
                </Typography>

                <List
                    component="nav"
                    sx={{ bgcolor: "background.paper", maxWidth: "200px" }}
                >
                    <ListItem
                        button
                        id="lock-button"
                        aria-haspopup="listbox"
                        aria-controls="lock-menu"
                        aria-label="Filter ads by category"
                        aria-expanded={open ? true : undefined}
                        onClick={handleClickListItem}
                    >
                        <ListItemText
                            primary="Filter ads by category"
                            secondary={
                                categories.length > 0 &&
                                categories[selected].name
                            }
                        />
                    </ListItem>
                </List>
                <Menu
                    id="lock-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "lock-button",
                        role: "listbox",
                    }}
                >
                    {categories &&
                        categories.map((category, index) => (
                            <MenuItem
                                key={category.name}
                                selected={selected === index}
                                onClick={(event) =>
                                    handleMenuItemClick(event, index)
                                }
                            >
                                {category.name}
                            </MenuItem>
                        ))}
                </Menu>

                <Grid
                    container
                    spacing={4}
                    alignItems="stretch"
                    sx={{ mt: "20px", mb: "50px" }}
                >
                    {ads && filtered.length === 0 && (
                        <Typography variant="h4" align="center" width="100%">
                            Nothing to see here
                        </Typography>
                    )}
                    {ads &&
                        filtered.length > 0 &&
                        filtered.map((el) => (
                            <Grid item sm={6} xs={12} key={el._id}>
                                <Card
                                    elevation={3}
                                    sx={{
                                        height: "100%",
                                        borderRadius: "20px",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <CardActionArea href={`/ads/${el._id}`}>
                                        <CardContent sx={{ height: "100%" }}>
                                            <Typography
                                                variant="h5"
                                                align="center"
                                            >
                                                {el.title}
                                            </Typography>
                                            <Divider
                                                sx={{
                                                    mt: "auto",
                                                    pt: "10px",
                                                    pb: "10px",
                                                }}
                                            >
                                                <Chip
                                                    variant="outlined"
                                                    label={el.category}
                                                />
                                            </Divider>
                                            <Typography
                                                variant="body1"
                                                color="text.secondary"
                                                align="center"
                                            >
                                                {el.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </Container>

            <Tooltip title="Add new advert">
                <Fab
                    color="primary"
                    sx={{ position: "fixed", bottom: "25px", right: "25px" }}
                    onClick={handleClickOpen}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>

            <Dialog open={display} onClose={handleClickClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Add new advert</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            We highly recommend to set an effective advert by
                            completing all our required fields.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            fullWidth
                            id="title"
                            name="title"
                            label="Title"
                            type="text"
                            variant="standard"
                            margin="dense"
                            helperText={titleError}
                            error={titleError.length > 0}
                        />
                        <TextField
                            required
                            fullWidth
                            id="description"
                            name="description"
                            label="Description"
                            type="text"
                            variant="standard"
                            margin="dense"
                            helperText={descError}
                            error={descError.length > 0}
                        />
                        <TextField
                            required
                            fullWidth
                            id="price"
                            name="price"
                            label="Price"
                            type="number"
                            variant="standard"
                            margin="dense"
                            helperText={priceError}
                            error={priceError.length > 0}
                        />
                        <FormControl
                            required
                            sx={{ mt: "15px" }}
                            error={categoryError.length > 0}
                        >
                            <FormLabel id="category" name="category">
                                Category
                            </FormLabel>
                            <RadioGroup row name="category">
                                {categories &&
                                    categories.map((el, idx) =>
                                        idx > 0 ? (
                                            <FormControlLabel
                                                value={el.name}
                                                control={<Radio />}
                                                label={el.name}
                                            />
                                        ) : null
                                    )}
                            </RadioGroup>
                            <FormHelperText>{categoryError}</FormHelperText>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClickClose}>Close</Button>
                        <Button type="submit">Post ad</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </ThemeProvider>
    );
}
