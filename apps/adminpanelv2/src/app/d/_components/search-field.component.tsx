import { Input } from "@/components/ui/input";
import { useFileSearch } from "@/context/file-search/file-search.context";
import { useDebounceCallback } from "@/hooks/use-debounce-callback.hook";

export function SearchFieldComponent() {
  const { search, setSearch } = useFileSearch();

  const debouncedSetSearch = useDebounceCallback(setSearch, 300);

  return <Input type="text" placeholder="Search" onChange={(e) => debouncedSetSearch(e.target.value)} />;
}
