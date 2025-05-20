import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { IdeasGrid } from "@/components/ideas/ideas-grid";
import { IdeasHeader } from "@/components/ideas/ideas-header";
import { IdeasFilters } from "@/components/ideas/ideas-filters";
import { IdeaModal } from "@/components/ideas/idea-modal";
import { CreateIdeaButton } from "@/components/ideas/create-idea-button";

export default function IdeasPage() {
  return (
    <div className="min-h-screen bg-white w-full">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <IdeasHeader />

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search ideas..."
              className="pl-9 rounded-full border-gray-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Sort</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <aside className="hidden md:col-span-3 md:block">
            <IdeasFilters />
          </aside>

          <div className="md:col-span-9">
            <IdeasGrid />
          </div>
        </div>
      </main>

      {/* Modal for idea details and trading */}
      <IdeaModal />
      <CreateIdeaButton />
    </div>
  );
}
