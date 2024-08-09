import { Input } from '@/components/ui/input';
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router';
import React from 'react'

const Search = () => {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = React.useState(searchParams.get("search") || "");



    React.useEffect(() => {
        setSearch(() => searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("search", search);
        router.push(`${pathname}?${newSearchParams}`);
    }


    return (
        <form
            onSubmit={handleSearch}
        >
            <Input
                type="text"
                placeholder="Search questions"
                value={search}
                onChange={ e => setSearch(e.target.value)}
            />
            <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
                Search
            </button>
        </form>
    )
}

export default Search
