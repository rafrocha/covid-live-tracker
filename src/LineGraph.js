import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { CardContent, CircularProgress } from '@material-ui/core';
import { buildChartData } from './utils';
import './LineGraph.css';
import numeral from 'numeral';

const options = {
  legend: {
    display: false
  },
  title: {
    display: true,
    text: 'Worldwide Cases by Country'
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
          format: 'MM/DD/YY',
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

const LineGraph = ({ maintainAspectRatio }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
      .then(({ data }) => {
        const chartData = buildChartData(data);
        setData(chartData);
        setLoading(false);
      });
  }, []);

  return (
    <div className="graph-container">
      {loading ? (
        <CardContent>
          <CircularProgress />
        </CardContent>
      ) : (
        <Line
          options={{ ...options, maintainAspectRatio }}
          data={{
            datasets: [
              {
                fill: true,
                data,
                backgroundColor: 'rgba(229, 111, 111, 0.7)',
                borderColor: '#CC1034'
              }
            ]
          }}
        />
      )}
    </div>
  );
};

export default LineGraph;
