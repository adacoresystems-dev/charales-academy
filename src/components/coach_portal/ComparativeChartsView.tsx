import React, { useState } from 'react';
import { Radar, Users, GitCompare, Award, Info, ArrowRight } from 'lucide-react';
import { Player, TechnicalSkills } from './types';
import { RadarChart } from './RadarChart';

interface ComparativeChartsViewProps {
  category: string;
  players: Player[];
}

export const ComparativeChartsView: React.FC<ComparativeChartsViewProps> = ({
  category,
  players
}) => {
  const categoryPlayers = players.filter(p => p.category === category);

  const [compareMode, setCompareMode] = useState<'categoryAverage' | 'headToHead'>('categoryAverage');
  const [playerAId, setPlayerAId] = useState<string>(categoryPlayers[0]?.id || '');
  const [playerBId, setPlayerBId] = useState<string>(categoryPlayers[1]?.id || categoryPlayers[0]?.id || '');

  const playerA = categoryPlayers.find(p => p.id === playerAId) || categoryPlayers[0];
  const playerB = categoryPlayers.find(p => p.id === playerBId) || categoryPlayers[1];

  // Calculate true category average skills
  const calculatedCategoryAverage: TechnicalSkills = {
    control: Number((categoryPlayers.reduce((a, b) => a + b.currentSkills.control, 0) / (categoryPlayers.length || 1)).toFixed(1)),
    pase: Number((categoryPlayers.reduce((a, b) => a + b.currentSkills.pase, 0) / (categoryPlayers.length || 1)).toFixed(1)),
    tiro: Number((categoryPlayers.reduce((a, b) => a + b.currentSkills.tiro, 0) / (categoryPlayers.length || 1)).toFixed(1)),
    velocidad: Number((categoryPlayers.reduce((a, b) => a + b.currentSkills.velocidad, 0) / (categoryPlayers.length || 1)).toFixed(1)),
    tactica: Number((categoryPlayers.reduce((a, b) => a + b.currentSkills.tactica, 0) / (categoryPlayers.length || 1)).toFixed(1)),
    disciplina: Number((categoryPlayers.reduce((a, b) => a + b.currentSkills.disciplina, 0) / (categoryPlayers.length || 1)).toFixed(1)),
  };

  const radarDatasets = compareMode === 'categoryAverage' 
    ? [
        {
          label: playerA?.name || 'Jugador',
          skills: playerA ? playerA.currentSkills : calculatedCategoryAverage,
          strokeColor: '#3B59A8',
          fillColor: 'rgba(59, 89, 168, 0.25)'
        },
        {
          label: `Promedio Categoría (${category.split(' ')[0]})`,
          skills: calculatedCategoryAverage,
          strokeColor: '#94A3B8',
          fillColor: 'rgba(148, 163, 184, 0.15)'
        }
      ]
    : [
        {
          label: playerA?.name || 'Jugador A',
          skills: playerA ? playerA.currentSkills : calculatedCategoryAverage,
          strokeColor: '#3B59A8',
          fillColor: 'rgba(59, 89, 168, 0.25)'
        },
        {
          label: playerB?.name || 'Jugador B',
          skills: playerB ? playerB.currentSkills : calculatedCategoryAverage,
          strokeColor: '#E31B23',
          fillColor: 'rgba(227, 27, 35, 0.25)'
        }
      ];

  const skillKeys: { key: keyof TechnicalSkills; label: string }[] = [
    { key: 'control', label: 'Control de Balón' },
    { key: 'pase', label: 'Pase y Distribución' },
    { key: 'tiro', label: 'Tiro y Definición' },
    { key: 'velocidad', label: 'Velocidad y Agilidad' },
    { key: 'tactica', label: 'Inteligencia Táctica' },
    { key: 'disciplina', label: 'Disciplina y Compromiso' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Radar className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-[#111111]">
                Gráficos Comparativos y Análisis Multidimensional
              </h1>
              <p className="text-xs text-neutral-500">
                Visualización en gráfico radar SVG de habilidades y confrontación de métricas técnicas.
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-1 bg-[#F8F9FA] rounded-xl border border-neutral-200 self-start sm:self-auto">
          <button
            onClick={() => setCompareMode('categoryAverage')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              compareMode === 'categoryAverage' 
                ? 'bg-[#3B59A8] text-white shadow-xs' 
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Jugador vs Promedio
          </button>
          <button
            onClick={() => setCompareMode('headToHead')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              compareMode === 'headToHead' 
                ? 'bg-[#E31B23] text-white shadow-xs' 
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Cara a Cara (1 vs 1)
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-neutral-700">
            {compareMode === 'headToHead' ? 'Jugador A (Azul):' : 'Jugador a Evaluar:'}
          </label>
          <select
            value={playerAId}
            onChange={(e) => setPlayerAId(e.target.value)}
            className="text-xs font-semibold bg-[#F8F9FA] border border-neutral-300 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-[#3B59A8] outline-none"
          >
            {categoryPlayers.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.dorsal} {p.name} ({p.position})
              </option>
            ))}
          </select>
        </div>

        {compareMode === 'headToHead' && (
          <div className="flex items-center gap-2 pl-4 border-l border-neutral-200">
            <label className="text-xs font-bold text-neutral-700">
              Jugador B (Rojo):
            </label>
            <select
              value={playerBId}
              onChange={(e) => setPlayerBId(e.target.value)}
              className="text-xs font-semibold bg-[#F8F9FA] border border-neutral-300 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-[#E31B23] outline-none"
            >
              {categoryPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.dorsal} {p.name} ({p.position})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Grid: Radar Chart + Detailed Metric Comparison Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Graphic Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col items-center justify-between">
          <div className="w-full text-center pb-2 border-b border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Polígono Radar de Competencias
            </h3>
            <span className="text-[11px] text-neutral-500">
              {compareMode === 'categoryAverage' 
                ? `${playerA?.name} vs Promedio de Categoría` 
                : `${playerA?.name} vs ${playerB?.name}`
              }
            </span>
          </div>

          <div className="py-4">
            <RadarChart
              size={320}
              data={radarDatasets}
            />
          </div>

          <div className="w-full p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900">
              <Info className="w-3.5 h-3.5 text-[#3B59A8]" />
              <span>Interpretación Pedagógica:</span>
            </div>
            <p>
              El polígono cerrado permite identificar simetría motriz y desequilibrios tácticos antes de pasar al fútbol de competencia formal.
            </p>
          </div>
        </div>

        {/* Detailed Side-by-side Metric Bars (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Comparativa Desglosada por Dimensión (Escala 1 a 10)
            </h3>
            <span className="text-[11px] font-mono text-neutral-500">
              Valores tabulares
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {skillKeys.map(({ key, label }) => {
              const valA = playerA ? playerA.currentSkills[key] : calculatedCategoryAverage[key];
              const valB = compareMode === 'headToHead' 
                ? (playerB ? playerB.currentSkills[key] : calculatedCategoryAverage[key])
                : calculatedCategoryAverage[key];

              const diff = (valA - valB).toFixed(1);

              return (
                <div key={key} className="p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-900">{label}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-[#3B59A8]">{valA}</span>
                      <span className="text-neutral-400">vs</span>
                      <span className={compareMode === 'headToHead' ? 'text-[#E31B23]' : 'text-neutral-600'}>
                        {valB}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        parseFloat(diff) > 0 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : parseFloat(diff) < 0 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-neutral-200 text-neutral-700'
                      }`}>
                        {parseFloat(diff) > 0 ? `+${diff}` : diff}
                      </span>
                    </div>
                  </div>

                  {/* Dual comparison bars */}
                  <div className="space-y-1">
                    {/* Bar A */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-[#3B59A8] w-12 truncate">
                        {playerA?.name.split(' ')[0]}
                      </span>
                      <div className="flex-1 bg-neutral-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#3B59A8] h-full rounded-full transition-all"
                          style={{ width: `${(valA / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Bar B */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold w-12 truncate ${
                        compareMode === 'headToHead' ? 'text-[#E31B23]' : 'text-neutral-500'
                      }`}>
                        {compareMode === 'headToHead' ? playerB?.name.split(' ')[0] : 'Media'}
                      </span>
                      <div className="flex-1 bg-neutral-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            compareMode === 'headToHead' ? 'bg-[#E31B23]' : 'bg-neutral-400'
                          }`}
                          style={{ width: `${(valB / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
