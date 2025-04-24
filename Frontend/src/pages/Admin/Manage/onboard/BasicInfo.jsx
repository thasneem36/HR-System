import React from 'react';
import {
  Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Autocomplete
} from '@mui/material';

const BasicInfo = ({
  form, formErrors, handleChange, roles, jobs,
  managers, managerQuery, setManagerQuery, setForm
}) => {
  const handleNICBlur = () => {
    const nic = form.nic;
    let year, day;

    if (/^\d{9}[vVxX]$/.test(nic)) {
      year = 1900 + parseInt(nic.substring(0, 2));
      day = parseInt(nic.substring(2, 5));
    } else if (/^\d{12}$/.test(nic)) {
      year = parseInt(nic.substring(0, 4));
      day = parseInt(nic.substring(4, 7));
    } else {
      return; // silently ignore invalid
    }

    if (day > 500) day -= 500;
    const dob = new Date(year, 0);
    dob.setDate(day);
    const formattedDOB = dob.toISOString().slice(0, 10);

    setForm(prev => ({ ...prev, dob: formattedDOB }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} width={410}>
        <TextField fullWidth label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={!!formErrors.firstName} helperText={formErrors.firstName} />
      </Grid>
      <Grid item xs={12} sm={6} width={410}>
        <TextField fullWidth label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={!!formErrors.lastName} helperText={formErrors.lastName} />
      </Grid>
      <Grid item xs={12} sm={6} width={410}>
        <TextField fullWidth label="Department" name="department" value={form.department} onChange={handleChange} />
      </Grid>
      <Grid item xs={12} width={410}>
        <Autocomplete
          options={managers}
          getOptionLabel={(option) => option.Name || ''}
          inputValue={managerQuery}
          onInputChange={(e, v) => setManagerQuery(v)}
          onChange={(e, value) =>
            setForm(prev => ({ ...prev, reportingManager: value?.EMPID || '' }))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Reporting Manager"
              error={!!formErrors.reportingManager}
              helperText={formErrors.reportingManager}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6} width={410}>
        <FormControl fullWidth error={!!formErrors.role}>
          <InputLabel>Role</InputLabel>
          <Select name="role" value={form.role} onChange={handleChange}>
            <MenuItem value="">Select Role</MenuItem>
            {roles.map((r) => (
              <MenuItem key={r.RoleID} value={r.RoleID}>{r.RoleName}</MenuItem>
            ))}
          </Select>
          <FormHelperText>{formErrors.role}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} width={410}>
        <FormControl fullWidth error={!!formErrors.employmentType}>
          <InputLabel>Employment Type</InputLabel>
          <Select name="employmentType" value={form.employmentType} onChange={handleChange}>
            <MenuItem value="1">Full-time</MenuItem>
            <MenuItem value="2">Part-time</MenuItem>
            <MenuItem value="3">Intern</MenuItem>
            <MenuItem value="4">Contract</MenuItem>
          </Select>
          <FormHelperText>{formErrors.employmentType}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} width={410}>
        <TextField
          fullWidth type="date" label="Start Date"
          name="startDate" value={form.startDate}
          onChange={handleChange} InputLabelProps={{ shrink: true }}
          error={!!formErrors.startDate} helperText={formErrors.startDate}
        />
      </Grid>
      <Grid item xs={12} sm={6} width={410}>
        <FormControl fullWidth error={!!formErrors.job_id}>
          <InputLabel>Job Title</InputLabel>
          <Select name="job_id" value={form.job_id} onChange={handleChange}>
            <MenuItem value="">Select Job</MenuItem>
            {jobs.map((job) => (
              <MenuItem key={job.JobID} value={job.JobID}>{job.JobTitle}</MenuItem>
            ))}
          </Select>
          <FormHelperText>{formErrors.job_id}</FormHelperText>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={6} width={410}>
        <TextField
          fullWidth
          label="NIC"
          name="nic"
          value={form.nic}
          onChange={handleChange}
          onBlur={handleNICBlur}
          error={!!formErrors.nic}
          helperText={formErrors.nic}
        />
      </Grid>
      <Grid item xs={12} sm={6} width={410}>
        <TextField
          fullWidth type="date" label="Date of Birth" name="dob"
          value={form.dob} onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  );
};

export default BasicInfo;