/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Drum, Heart, Sparkles } from 'lucide-react';

export default function FooterCredits() {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
            <Drum className="h-4 w-4" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-sm">BatuCall</span>
            <span className="text-xs text-slate-500 block">Sinfonías de Calle & Percusión de Bloque</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
          <span>Diseñado para directores de Batucada con</span>
          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
          <span>y</span>
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
        </div>

      </div>
    </footer>
  );
}
