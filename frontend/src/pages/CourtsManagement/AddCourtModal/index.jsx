import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const DEFAULT_FORM_DATA = {
    name: '',
    location: '',
    size: ''
}

const AddCourtModal = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };
    const handleClose = () => {
        setFormData(DEFAULT_FORM_DATA);
        onClose?.();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography variant="h6" component="h2">Add Court</Typography>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-4 justify-center items-center'>
                        <TextField
                            label="Court Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Court Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Court Size"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            fullWidth
                        />
                        <Button type="submit" variant="contained">Add Court</Button>
                    </div>
                </form>
            </Box>
        </Modal>
    )
}

export default AddCourtModal;
