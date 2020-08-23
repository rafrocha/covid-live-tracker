import React from 'react';
import CountUp from 'react-countup';
import numeral from 'numeral';
import './InfoBox.css';

import {
  Card,
  CardContent,
  Typography,
  CircularProgress
} from '@material-ui/core';

const InfoBox = ({
  active,
  isRed,
  isOrange,
  isGreen,
  title,
  cases,
  total,
  ...props
}) => (
  <Card
    onClick={props.onClick}
    className={`infoBox ${active && 'infoBox--selected'} ${isRed &&
      'infoBox--red'} ${isOrange && 'infoBox--orange'} ${isGreen &&
      'infoBox--green'}`}
  >
    {cases || cases === 0 ? (
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <CountUp
          className={`infoBox__cases ${isOrange &&
            'infoBox__cases--orange'} ${isGreen && 'infoBox__cases--green'}`}
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
