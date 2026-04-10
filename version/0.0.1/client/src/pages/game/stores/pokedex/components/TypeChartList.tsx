// - Path: "PokeRotom/client/src/pages/game/stores/pokedex/components/TypeChartList.tsx"
import { Table, Info } from 'lucide-react';
import type { TypeElement } from '../../../../../types/pokemon';

interface TypeChartListProps {
    data: TypeElement[];
}

export default function TypeChartList({ data }: TypeChartListProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {data.map((type) => (
                <div
                    key={type.id}
                    className="po-section p-4 text-center group cursor-help hover:scale-105 transition-all"
                >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <Table size={20} />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-xs text-slate-400 group-hover:text-white">
                        {type.name}
                    </span>
                </div>
            ))}
            <div className="col-span-full mt-8 po-section p-8 text-center bg-slate-900/80 border-dashed border-slate-700">
                <Info className="mx-auto mb-4 text-slate-500" size={32} />
                <h4 className="text-xl font-bold text-white mb-2">
                    Type Effectiveness Matrix
                </h4>
                <p className="text-slate-500 max-w-lg mx-auto">
                    ระบบกำลังวิเคราะห์ข้อมูลความต้านทานและจุดอ่อนธาตุทั้งหมด
                    ตารางโต้ตอบกำลังจะมาเร็วๆ นี้!
                </p>
            </div>
        </div>
    );
}
