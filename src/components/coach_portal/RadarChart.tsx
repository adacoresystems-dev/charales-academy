import React from 'react';
import { TechnicalSkills } from './types';

interface Dataset {
  label: string;
  skills: TechnicalSkills;
  strokeColor: string;
  fillColor: string;
}

interface RadarChartProps {
  data: Dataset[];
  size?: number;
  className?: string;
  showLabels?: boolean;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 320,
  className = '',
  showLabels = true
}) => {
  const axes = [
    { key: 'control' as keyof TechnicalSkills, label: 'Control' },
    { key: 'pase' as keyof TechnicalSkills, label: 'Pase' },
    { key: 'tiro' as keyof TechnicalSkills, label: 'Tiro' },
    { key: 'velocidad' as keyof TechnicalSkills, label: 'Velocidad' },
    { key: 'tactica' as keyof TechnicalSkills, label: 'Táctica' },
    { key: 'disciplina' as keyof TechnicalSkills, label: 'Disciplina' },
  ];

  const center = size / 2;
  const radius = (size / 2) - 40;
  const totalAxes = axes.length;
  const levels = [2, 4, 6, 8, 10];

  // Helper to calculate coordinates
  const getCoordinates = (index: number, value: number, max: number = 10) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / max) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Concentric Polygons */}
        {levels.map((level) => {
          const points = axes.map((_, i) => {
            const { x, y } = getCoordinates(i, level);
            return `${x},${y}`;
          }).join(' ');

          return (
            <g key={level}>
              <polygon
                points={points}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray={level % 4 === 0 ? 'none' : '2,2'}
              />
              <text
                x={center + 4}
                y={center - ((level / 10) * radius) + 3}
                fontSize="9"
                fill="#94A3B8"
                fontWeight="bold"
                className="font-mono tabular-nums select-none"
              >
                {level}
              </text>
            </g>
          );
        })}

        {/* Axis Spokes & Labels */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, 10);
          const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
          const labelDist = radius + 22;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle) + 4;

          return (
            <g key={axis.key}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#CBD5E1"
                strokeWidth="1.2"
              />
              {showLabels && (
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#1E293B"
                  className="select-none tracking-tight"
                >
                  {axis.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Datasets Polygons */}
        {data.map((dataset, idx) => {
          const points = axes.map((axis, i) => {
            const val = dataset.skills[axis.key];
            const { x, y } = getCoordinates(i, val);
            return `${x},${y}`;
          }).join(' ');

          return (
            <g key={idx}>
              <polygon
                points={points}
                fill={dataset.fillColor}
                stroke={dataset.strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
              {/* Vertex dots */}
              {axes.map((axis, i) => {
                const val = dataset.skills[axis.key];
                const { x, y } = getCoordinates(i, val);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={dataset.strokeColor}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="hover:r-5 transition-all"
                  >
                    <title>{`${dataset.label} - ${axis.label}: ${val}/10`}</title>
                  </circle>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Legend below chart */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs">
        {data.map((dataset, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-sm inline-block"
              style={{ backgroundColor: dataset.strokeColor }}
            />
            <span className="font-semibold text-neutral-800">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
