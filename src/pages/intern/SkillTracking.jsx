import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

const SkillTracking = () => {
  const skills = [
    { name: 'ReactJS', progress: 80 },
    { name: 'Redux', progress: 65 },
    { name: 'JavaScript', progress: 90 },
    { name: 'HTML/CSS', progress: 85 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Theo dõi kỹ năng</Typography>
      
      <List>
        {skills.map((skill, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={skill.name}
              secondary={
                <LinearProgress 
                  variant="determinate" 
                  value={skill.progress} 
                  sx={{ mt: 1 }}
                />
              }
            />
            <Typography>{`${skill.progress}%`}</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SkillTracking;