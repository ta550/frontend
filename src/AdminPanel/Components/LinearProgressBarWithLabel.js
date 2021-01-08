import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function LinearProgressWithLabel(props) {
    return (
      <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100"
        heigth="100"
      >
        <Typography variant="caption" component="div" className="text-white">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
    );
  }

  export default LinearProgressWithLabel;