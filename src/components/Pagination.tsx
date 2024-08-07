"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

const Pagination = ({
    className,
    total,
    limit,
}: {
    className?: string;
    limit: number;
    total: number;
}) => {

    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const totalpages = Math.ceil(total / limit);
    const router = useRouter();
    const pathname = usePathname();

    const prev = () => {
        if (page <= "1") return;
        const pageNumber = parseInt(page);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", `${pageNumber - 1}`);
        router.push(`${pathname}?${newSearchParams}`)
    }

    const next = () => {
        if (page <= "1") return;
        const pageNumber = parseInt(page);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", `${pageNumber + 1}`);
        router.push(`${pathname}?${newSearchParams}`)
    }





    return (
        <div className="flex items-center justify-center gap-4">
            <button
                className={`${className} rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20`}
                onClick={prev}
                disabled={page <= "1"}
            >
                Previous
            </button>
            <span>
                {page} of {totalpages || "1"} {/* incase totalPage is 0 */}
            </span>
            <button
                className={`${className} rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20`}
                onClick={next}
                disabled={page >= `${totalpages}`}
            >
                Next
            </button>
        </div>
    )
}

export default Pagination
