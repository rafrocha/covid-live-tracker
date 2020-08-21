import React from 'react';
import CountUp from 'react-countup';
import numeral from 'numeral';

import {
  Card,
  CardContent,
  Typography,
  CircularProgress
} from '@material-ui/core';

const InfoBox = ({ title, cases, total }) => (
  <Card className="infoBox">
    {cases || cases === 0 ? (
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <CountUp
          className="infoBox__cases"
          start={0}
          end={cases}
          duration={2}
          separator=","
        />
        <Typography className="infoBox__total" color="textSecondary">
          {numeral(total).format('0,0')} Total
        </Typography>
      </CardContent>
    ) : (
      <CardContent>
        <CircularProgress />
      </CardContent>
    )}
  </Card>
);

export default InfoBox;
