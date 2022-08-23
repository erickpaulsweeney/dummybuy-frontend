import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import CardMedia from "@mui/material/CardMedia";
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
import Avatar from "@mui/material/Avatar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { TextField } from "@mui/material";
import { blue } from "@mui/material/colors";

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
    const navigate = useNavigate();

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

    const refreshToken = async () => {
        console.log(JSON.parse(localStorage.getItem("userDetails")))
        try {
            const response = await fetch("http://localhost:8000/auth/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: localStorage.getItem("userDetails"),
            });
            const data = await response.json();
            console.log(data);
            if (response.status !== 200) {
                alert(data.message);
                return false;
            } else {
                localStorage.setItem("userDetails", JSON.stringify({
                    ...user,
                    access_token: data.access_token,
                }));
                setUser({
                    ...user,
                    access_token: data.access_token,
                })
                return true;
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:8000/category", {
                headers: { Authorization: `Bearer ${user.access_token}` },
            });
            const data = await response.json();
            if (response.status === 403) {
                const fetchToken = await refreshToken();
                if (!fetchToken) {
                    alert("Something wrong happened. Please login again.");
                    localStorage.removeItem("userDetails");
                    navigate("/login");
                }
            }
            setCategories([{ name: "All" }].concat(data));
        } catch (error) {
            console.log(error.message);
        }
    };

    const fetchAds = async () => {
        try {
            const response = await fetch("http://localhost:8000/ads", {
                headers: { Authorization: `Bearer ${user.access_token}` },
            });
            const data = await response.json();
            if (response.status === 403) {
                const fetchToken = await refreshToken();
                if (!fetchToken) {
                    alert("Something wrong happened. Please login again.");
                    localStorage.removeItem("userDetails");
                    navigate("/login");
                }
            }
            setAds(data);
            setFiltered(data);
            console.log(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const submitAd = async (input) => {
        console.log(input);
        try {
            const response = await fetch("http://localhost:8000/ads", {
                method: "POST",
                mode: "cors",
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                },
                body: input,
            });
            const data = await response.json();
            if (response.status === 403) {
                const fetchToken = await refreshToken();
                if (!fetchToken) {
                    alert("Something wrong happened. Please login again.");
                    localStorage.removeItem("userDetails");
                    navigate("/login");
                }
            }
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
        data.append("seller", user.data.id);
        const title = data.get("title");
        const description = data.get("description");
        const price = data.get("price");
        const category = data.get("category");
        const image = data.get("image");
        console.log(image);
        for (const value of data.values()) {
            console.log(value);
        }

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
            if (!titleError && !descError && !priceError) return submitAd(data);
        }

        if (!titleError && !descError && !priceError && !categoryError)
            return submitAd(data);
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
        fetchCategories();
        fetchAds();
        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        const data = localStorage.getItem("userDetails");
        if (data !== null) {
            setUser(JSON.parse(data));
        }
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
                                <Tooltip
                                    title={
                                        el.buyer
                                            ? "Item already sold"
                                            : `${
                                                  el.interestedBuyers.length > 0
                                                      ? el.interestedBuyers
                                                            .length
                                                      : "No"
                                              } interested buyer${
                                                  el.interestedBuyers.length > 1
                                                      ? "s"
                                                      : ""
                                              }`
                                    }
                                    placement="top"
                                >
                                    <Card
                                        elevation={3}
                                        sx={{
                                            height: "100%",
                                            borderRadius: "20px",
                                            display: "flex",
                                            justifyContent: "center",
                                            position: "relative",
                                        }}
                                    >
                                        <CardActionArea href={`/ads/${el._id}`}>
                                            <CardMedia
                                                component="img"
                                                alt={el.title}
                                                image={el.image}
                                            />
                                            <CardContent
                                                sx={{
                                                    height: "100%",
                                                    position: "relative",
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        bgcolor: blue[600],
                                                        position: "absolute",
                                                        fontSize: "10px",
                                                        top: "-20px",
                                                        right: "0",
                                                        left: "0",
                                                        ml: "auto",
                                                        mr: "auto",
                                                        transition:
                                                            "transform 0.15s",
                                                        "&:hover": {
                                                            transform:
                                                                "scale(1.5)",
                                                        },
                                                    }}
                                                >{`$${el.price}`}</Avatar>
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
                                                        variant="filled"
                                                        label={el.category}
                                                        color="primary"
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
                                </Tooltip>
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
                        <Button
                            variant="contained"
                            component="label"
                            name="image"
                        >
                            Upload Image
                            <input type="file" name="image" hidden />
                        </Button>
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
