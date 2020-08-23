import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { CardContent, CircularProgress } from '@material-ui/core';
import { buildChartData, casesTypeColors } from './utils';
import './LineGraph.css';
import numeral from 'numeral';

const options = {
  legend: {
    display: false
  },
  title: {
    display: false
  },
  elements: {
    point: {
      radius: 0
    }
  },
  tooltips: {
    mode: 'index',
    intersect: false,
    callbacks: {
      label: function(tooltipItem, data) {
        return numeral(tooltipItem.value).format('+0,0');
      }
    }
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          parser: 'MM/DD/YY',
          tooltipFormat: 'll'
        }
      }
    ],
    yAxes: [
      {
        gridLines: {
          display: false
        },
        ticks: {
          callback: function(value, index, values) {
            return numeral(value).format('0a');
          }
        }
      }
    ]
  }
};

const LineGraph = ({ casesType = 'cases', ...props }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
      .then(({ data }) => {
        const chartData = buildChartData(data, casesType);
        setData(chartData);
        setLoading(false);
      });
  }, [casesType]);

  return (
    <div className={props.className}>
      {loading ? (
        <CardContent>
          <CircularProgress />
        </CardContent>
      ) : (
        <Line
          options={{ ...options, maintainAspectRatio: false }}
          data={{
            datasets: [
              {
                fill: true,
                data,
                backgroundColor: casesTypeColors[casesType].half_op,
                borderColor: casesTypeColors[casesType].hex
              }
            ]
          }}
        />
      )}
    </div>
  );
};

export default LineGraph;
