import React from 'react';
import {
  Grid, TextField, IconButton, Tooltip, Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const ContactInfo = ({ form, setForm, handleChange, formErrors }) => {
  const handleAddPhone = () => {
    setForm(prev => ({
      ...prev,
      phoneNumbers: [...(prev.phoneNumbers || []), '']
    }));
  };


  const handlePhoneChange = (index, value) => {
    const updated = [...(form.phoneNumbers || [])];
    updated[index] = value;
    setForm(prev => ({ ...prev, phoneNumbers: updated }));
  };

  const handleRemovePhone = (index) => {
    const updated = [...form.phoneNumbers];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, phoneNumbers: updated }));
  };

  return (
    <Grid container spacing={2} >
      <Grid item xs={12} marginRight={50}>
        <Typography variant="subtitle1" fontWeight={600} mt={2}>
          Email
        </Typography>
      </Grid>
      {/* Email */}
      <Grid item xs={12} width={500}>
        <TextField
          fullWidth
          name="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
        />
      </Grid>
      <Grid item xs={12} marginRight={100}>
        <Typography variant="subtitle1" fontWeight={600} mt={2}>
          Phone
        </Typography>
      </Grid>
      {/* Primary Phone */}
      <Grid item xs={12} width={500}>
        <TextField
          fullWidth
          name="phone"
          label="Primary Phone Number"
          type="tel"
          value={form.phone}
          onChange={handleChange}
        />
      </Grid>

      {/* Additional Phone Numbers */}
      {(form.phoneNumbers || []).map((number, index) => (
        <Grid item xs={12} key={index} width={500}>
          <TextField
            fullWidth
            label={`Additional Phone #${index + 1}`}
            type="tel"
            value={number}
            onChange={(e) => handlePhoneChange(index, e.target.value)}
            InputProps={{
              endAdornment: (
                <Tooltip title="Remove">
                  <IconButton onClick={() => handleRemovePhone(index)}>
                    <RemoveCircleOutlineIcon color="error" />
                  </IconButton>
                </Tooltip>
              )
            }}
          />
        </Grid>
      ))}



      {/* Add Phone Button */}
      <Grid item xs={12} my={1}>
        <Tooltip title="Add another number">
          <IconButton color="primary" onClick={handleAddPhone}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Grid>

      {/* Address Title */}
      <Grid item xs={12} marginRight={100}>
        <Typography variant="subtitle1" fontWeight={600} mt={2}>
          Address
        </Typography>
      </Grid>

      {/* Address Fields */}
      <Grid item xs={12} width={410}>
        <TextField
          fullWidth
          name="streetNo"
          label="Street No."
          value={form.streetNo || ''}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} width={410}>
        <TextField
          fullWidth
          name="streetLine"
          label="Street Name"
          value={form.streetLine || ''}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} width={410}>
        <TextField
          fullWidth
          name="city"
          label="City"
          value={form.city || ''}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} width={410}>
        <TextField
          fullWidth
          name="district"
          label="District"
          value={form.district || ''}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} width={410}>
        <TextField
          fullWidth
          name="province"
          label="Province"
          value={form.province || ''}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} width={410}>
        <TextField
          fullWidth
          name="postalCode"
          label="Postal Code"
          value={form.streetLine || ''}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};

export default ContactInfo;
