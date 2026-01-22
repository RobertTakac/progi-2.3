import * as React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { getAllCategories, newCategory, deleteCategory } from "../services/apiService";
import { DialogActions, DialogContent } from '@mui/material';
import { toast } from 'react-toastify';

const drawerWidth = 240;

function NewCatModal(props) {
    const { handleClose, open, loading, handleSubmit, newCat, setNewCat } = props;

    const updateField = (field) => (e) => {
        setNewCat({...newCat, [field]: e.target.value});
    }

    return (
        <Dialog onClose={handleClose} open={open} fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Stvori novu kategoriju</DialogTitle>
                <DialogContent>
                        <TextField
                            autoFocus
                            name="name"
                            label="Ime"
                            value={newCat.name}
                            onChange={updateField("name")}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            name="description"
                            label="Opis"
                            value={newCat.description}
                            onChange={updateField("description")}
                            fullWidth
                            multiline
                            rows={3}
                            required
                        />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Odustani
                    </Button>

                    <Button type="submit" color="primary" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress /> : "Spremi"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

const emptyCat = {
    name: "",
    description: ""
}

const ControlBoard = ({ currentUser }) => {

    const [newCat, setNewCat] = useState(emptyCat);
    const [allCats, setAllCats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchCats = async () => {
        setLoading(true);
        const data = await getAllCategories();
        setAllCats(data);
        setLoading(false);
    }

    const handleNewCat = () => {
        setNewCat(emptyCat);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setNewCat(emptyCat);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await newCategory(newCat);
        } catch (err) {
            toast.error(err);
        }

        handleClose();
        await fetchCats();
        setLoading(false);
    }

    const handleDelete = async (id) => {
        setLoading(true);

        try {
            await deleteCategory(id);
        } catch (err) {
            toast.error(err);
        }

        await fetchCats();
        setLoading(false);
    }

    useEffect(() => {
        fetchCats();
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        position: 'relative'
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Divider />
                <List>
                    {['Kategorije'].map((text, ind) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {text === "Kategorije"? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <List>
                    { allCats?.map((currCat) => {                   
                        return(
                            <ListItem key={currCat.id} disablePadding>
                                <ListItemText primary={currCat.name} secondary={currCat.description} />
                                <IconButton aria-label="delete" color="primary" onClick={() => handleDelete(currCat.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        );
                    }) }
                </List>
                { (!allCats || allCats.length === 0) && <p className="no-ads-text">Nema kategorija.</p>}

                { loading && <CircularProgress />}

                <Button variant="outlined" onClick={handleNewCat}>Stvori novu kategoriju</Button>
                <NewCatModal open={open} handleClose={handleClose} loading={loading} handleSubmit={handleSubmit}
                    newCat={newCat} setNewCat={setNewCat}/>
            </Box>
        </Box>
    );
};

export default ControlBoard;