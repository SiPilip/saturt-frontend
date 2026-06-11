import { useState, useEffect } from "react"
import { useGetIuran } from "@/api/hooks/useIuran"
import type { Iuran } from "@/types/iuran"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, ArrowUpDown, Edit, Trash2 } from "lucide-react"
import { CreateIuranDialog, EditIuranDialog, DeleteIuranDialog } from "@/components/iuran/IuranDialogs"

export default function IuranList() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Sorting state
  const [sorting, setSorting] = useState<SortingState>([])

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editIuran, setEditIuran] = useState<Iuran | null>(null)
  const [deleteIuran, setDeleteIuran] = useState<Iuran | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch data
  const sortBy = sorting[0]?.id || 'nama'
  const sortDir = sorting[0]?.desc ? 'desc' : 'asc'
  const { data, isLoading } = useGetIuran(page, debouncedSearch, limit, sortBy, sortDir)

  // Table Columns
  const columns: ColumnDef<Iuran>[] = [
    {
      accessorKey: "nama",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-muted/50"
          >
            Nama Iuran
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <span className="font-semibold text-primary">{row.original.nama}</span>
      )
    },
    {
      accessorKey: "biaya",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-muted/50"
          >
            Biaya (Rp)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <span className="font-medium">
          Rp {row.original.biaya.toLocaleString('id-ID')}
        </span>
      )
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-muted/50"
          >
            Tgl. Dibuat
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {new Date(row.original.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </span>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const i = row.original
        return (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => setEditIuran(i)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setDeleteIuran(i)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Iuran</h1>
          <p className="text-muted-foreground mt-1">Kelola jenis-jenis tagihan wajib bagi warga (Kebersihan, Keamanan, dll).</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="shadow-md hover:shadow-lg transition-all">
          <Plus className="mr-2 h-4 w-4" /> Tambah Iuran
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-muted/50">
        <div className="flex items-center w-full max-w-sm relative">
          <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input
            placeholder="Cari nama iuran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white shadow-sm border-muted w-full"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-muted/50 p-4">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          pageCount={data?.meta?.total_pages}
          pageIndex={page}
          pageSize={limit}
          totalItems={data?.meta?.total || 0}
          onPageChange={setPage}
          onPageSizeChange={(newLimit) => {
            setLimit(newLimit)
            setPage(1)
          }}
          sorting={sorting}
          onSortingChange={setSorting}
        />
      </div>

      <CreateIuranDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <EditIuranDialog iuran={editIuran} open={!!editIuran} onOpenChange={(open) => !open && setEditIuran(null)} />
      <DeleteIuranDialog 
        iuran={deleteIuran} 
        open={!!deleteIuran} 
        onOpenChange={(open) => !open && setDeleteIuran(null)} 
      />
    </div>
  )
}
