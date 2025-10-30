'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginatorProps {
    offset: number;
    limit: number;
    total?: number;
    onChange: (newOffset: number) => void;
}

export default function Paginator({
    offset,
    limit,
    total,
    onChange,
}: PaginatorProps) {
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = total ? Math.ceil(total / limit) : null;

    const handlePrev = () => {
        if (offset <= 0) return;
        onChange(Math.max(0, offset - limit));
    };

    const handleNext = () => {
        if (totalPages && currentPage >= totalPages) return;
        onChange(offset + limit);
    };

    return (
        <div className="flex items-center justify-center gap-6 mt-8">
            <button
                onClick={handlePrev}
                disabled={offset === 0}
                className="
          flex items-center gap-1 px-4 py-2 rounded-full
          bg-white/10 hover:bg-white/20 disabled:opacity-40
          transition text-sm font-medium
        "
            >
                <ChevronLeft className="w-4 h-4" />
                Prev
            </button>

            <span className="text-gray-400 text-sm">
                Page <span className="text-white">{currentPage}</span>
                {totalPages ? ` / ${totalPages}` : ''}
            </span>

            <button
                onClick={handleNext}
                disabled={totalPages ? currentPage >= totalPages : false}
                className="
          flex items-center gap-1 px-4 py-2 rounded-full
          bg-white/10 hover:bg-white/20 disabled:opacity-40
          transition text-sm font-medium
        "
            >
                Next
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
