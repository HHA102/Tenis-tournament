import { Button } from '@mui/material';
import React, { useState } from 'react'
import AddCourtModal from './AddCourtModal';

const CourtsManagement = () => {
    const [open, setOpen] = useState(false);
    const [courts, setCourts] = useState([]);

    const handleSubmit = (formData) => {
        console.log(formData);
    }
    return (
        <div>
            <h1 className='text-2xl font-bold text-primary-500'>Courts Management</h1>
            <Button variant="contained" onClick={() => setOpen(true)}>Add Court</Button>
            <AddCourtModal open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
        </div>
    )
}

export default CourtsManagement;
