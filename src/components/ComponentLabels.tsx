import React from 'react';
import { MachinePartMetadata } from '../data/machineComponents';

export interface ProjectedPin {
  id: string;
  x: number;
  y: number;
  visible: boolean;
  meta: MachinePartMetadata;
}

interface ComponentLabelsProps {
  pins: ProjectedPin[];
  selectedPartId: string | null;
  showLabels: boolean;
  isExploded: boolean;
  onSelectPart: (partId: string) => void;
}

export const ComponentLabels: React.FC<ComponentLabelsProps> = ({
  pins,
  selectedPartId,
  showLabels,
  isExploded,
  onSelectPart,
}) => {
  if (!showLabels) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      {pins.map((pin) => {
        if (!pin.visible) return null;
        const isSelected = selectedPartId === pin.id;

        return (
          <div
            key={pin.id}
            style={{
              transform: `translate3d(${pin.x}px, ${pin.y}px, 0)`,
            }}
            className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
          >
            <div className="flex items-center gap-1.5">
              {/* Connector target reticle */}
              <span
                className="w-2.5 h-2.5 rounded-full border border-white shadow-sm shrink-0"
                style={{ backgroundColor: pin.meta.accentHex }}
              />
              {/* Leader line in Exploded View */}
              {isExploded && (
                <span className="w-4 h-px bg-[#174D35]/40 hidden sm:inline-block" />
              )}
              <button
                type="button"
                onClick={() => onSelectPart(pin.id)}
                className={`pointer-events-auto px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#174D35] text-white border-[#174D35] shadow-md scale-105'
                    : 'bg-white/90 text-[#112218] border-[#174D35]/20 hover:bg-white hover:border-[#174D35]'
                }`}
              >
                {pin.meta.shortLabel}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
