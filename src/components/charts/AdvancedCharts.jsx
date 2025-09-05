import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ComposedChart,
  ReferenceLine,
  Treemap
} from 'recharts';
import { Box, Typography, Paper, useTheme } from '@mui/material';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 2, boxShadow: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={index} variant="body2" sx={{ color: entry.color }}>
            {entry.name}: {formatter ? formatter(entry.value) : entry.value}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

// Performance Trend Chart
export const PerformanceTrendChart = ({ data, height = 300 }) => {
  const theme = useTheme();
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
        <YAxis stroke={theme.palette.text.secondary} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="performance"
          fill={theme.palette.primary.light}
          stroke={theme.palette.primary.main}
          fillOpacity={0.3}
          name="Hiệu suất"
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke={theme.palette.success.main}
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Mục tiêu"
          dot={false}
        />
        <Bar dataKey="completed" fill={theme.palette.info.main} name="Hoàn thành" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// Skills Radar Chart (using RadialBar as alternative)
export const SkillsRadarChart = ({ data, height = 300 }) => {
  const theme = useTheme();
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={data}>
        <RadialBar
          minAngle={15}
          label={{ position: 'insideStart', fill: '#fff' }}
          background
          clockWise
          dataKey="value"
          fill={theme.palette.primary.main}
        />
        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
        <Tooltip content={<CustomTooltip formatter={(value) => `${value}%`} />} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

// Department Distribution Treemap
export const DepartmentTreemap = ({ data, height = 300 }) => {
  const theme = useTheme();
  
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Treemap
        data={data}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke={theme.palette.background.paper}
        fill={theme.palette.primary.main}
        content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
          if (!payload || width < 10 || height < 10) return null;
          
          return (
            <g>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                  fill: COLORS[index % COLORS.length],
                  stroke: theme.palette.background.paper,
                  strokeWidth: 2,
                  strokeOpacity: 1,
                  fillOpacity: 0.8
                }}
              />
              {width > 50 && height > 30 && name && (
                <text
                  x={x + width / 2}
                  y={y + height / 2}
                  textAnchor="middle"
                  fill={theme.palette.common.white}
                  fontSize={12}
                  fontWeight="bold"
                >
                  {name}
                </text>
              )}
              {width > 50 && height > 50 && payload.size && (
                <text
                  x={x + width / 2}
                  y={y + height / 2 + 15}
                  textAnchor="middle"
                  fill={theme.palette.common.white}
                  fontSize={10}
                >
                  {payload.size}
                </text>
              )}
            </g>
          );
        }}
      />
    </ResponsiveContainer>
  );
};

// Intern Progress Scatter Chart
export const InternProgressScatter = ({ data, height = 300 }) => {
  const theme = useTheme();
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis
          type="number"
          dataKey="tasksCompleted"
          name="Tasks Completed"
          stroke={theme.palette.text.secondary}
        />
        <YAxis
          type="number"
          dataKey="performanceScore"
          name="Performance Score"
          stroke={theme.palette.text.secondary}
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <Paper sx={{ p: 2, boxShadow: 3 }}>
                  <Typography variant="subtitle2">{data.name}</Typography>
                  <Typography variant="body2">
                    Tasks: {data.tasksCompleted}
                  </Typography>
                  <Typography variant="body2">
                    Score: {data.performanceScore}
                  </Typography>
                  <Typography variant="body2">
                    Department: {data.department}
                  </Typography>
                </Paper>
              );
            }
            return null;
          }}
        />
        <Scatter name="Interns" data={data} fill={theme.palette.primary.main} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

// Multi-line Performance Chart
export const MultiLineChart = ({ data, lines, height = 300 }) => {
  const theme = useTheme();
  
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
        <YAxis stroke={theme.palette.text.secondary} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {lines.map((line, index) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            name={line.name}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

// Stacked Area Chart
export const StackedAreaChart = ({ data, areas, height = 300 }) => {
  const theme = useTheme();
  
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
        <YAxis stroke={theme.palette.text.secondary} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {areas.map((area, index) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            stackId="1"
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.7}
            name={area.name}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Horizontal Bar Chart
export const HorizontalBarChart = ({ data, height = 300 }) => {
  const theme = useTheme();
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        layout="horizontal"
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis type="number" stroke={theme.palette.text.secondary} />
        <YAxis dataKey="name" type="category" stroke={theme.palette.text.secondary} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="value" fill={theme.palette.primary.main} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Donut Chart with Custom Label
export const DonutChart = ({ data, height = 300, innerRadius = 60 }) => {
  const theme = useTheme();
  
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Chart Container with Title
export const ChartContainer = ({ title, children, action }) => {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
        {action}
      </Box>
      {children}
    </Paper>
  );
};

export default {
  PerformanceTrendChart,
  SkillsRadarChart,
  DepartmentTreemap,
  InternProgressScatter,
  MultiLineChart,
  StackedAreaChart,
  HorizontalBarChart,
  DonutChart,
  ChartContainer
};
