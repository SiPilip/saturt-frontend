import { useState, useEffect } from "react"
import { useGetPenghuni } from "@/api/hooks/usePenghuni"
import type { Penghuni } from "@/types/penghuni"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, ArrowUpDown, Edit, Trash2 } from "lucide-react"
import { CreatePenghuniDialog, EditPenghuniDialog, DeletePenghuniDialog } from "@/components/penghuni/PenghuniDialogs"
import { Badge } from "@/components/ui/badge"
import { PenghuniDetailPane } from "@/components/penghuni/PenghuniDetailPane"

export default function PenghuniList() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Split-pane selection state
  const [selectedPenghuni, setSelectedPenghuni] = useState<Penghuni | null>(null)

  // Sorting state
  const [sorting, setSorting] = useState<SortingState>([])

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editPenghuni, setEditPenghuni] = useState<Penghuni | null>(null)
  const [deletePenghuni, setDeletePenghuni] = useState<Penghuni | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1) // Reset page on new search
      setSelectedPenghuni(null) // Reset selection on search
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch data
  const sortBy = sorting[0]?.id || 'created_at'
  const sortDir = sorting[0]?.desc ? 'desc' : 'asc'
  const { data, isLoading } = useGetPenghuni(page, debouncedSearch, limit, sortBy, sortDir)

  // Sync selectedPenghuni with updated data (e.g. after edit)
  useEffect(() => {
    if (selectedPenghuni && data?.data) {
      const updated = data.data.find(p => p.id === selectedPenghuni.id)
      if (updated && updated !== selectedPenghuni) {
        setSelectedPenghuni(updated)
      } else if (!updated && !isLoading) {
        // If deleted, remove selection
        setSelectedPenghuni(null)
      }
    }
  }, [data, isLoading, selectedPenghuni])

  // Table Columns (Simplified for Split-Pane)
  const columns: ColumnDef<Penghuni>[] = [
    {
      accessorKey: "nama",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-muted/50"
          >
            Nama Penghuni
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const p = row.original;
        const hasRumah = p.penghuni_rumah && p.penghuni_rumah.length > 0;
        const hasUnpaid = hasRumah && (p.tagihan_belum_bayar_count ?? 0) > 0;

        let dotColor = null;
        let tooltipText = "";

        if (!hasRumah) {
          dotColor = "bg-amber-500";
          tooltipText = "Belum di-assign ke rumah";
        } else if (hasUnpaid) {
          dotColor = "bg-red-500";
          tooltipText = `${p.tagihan_belum_bayar_count} tagihan belum dibayar`;
        }

        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">{p.nama}</span>
            {dotColor && (
              <div 
                className={`h-1.5 w-1.5 rounded-full ${dotColor} opacity-70 flex-shrink-0`} 
                title={tooltipText}
              />
            )}
          </div>
        )
      }
    },
    {
      accessorKey: "nik",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-muted/50"
          >
            NIK
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "status_penghuni",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status_penghuni === 'tetap' ? 'default' : 'secondary'}>
          {row.original.status_penghuni === 'tetap' ? 'Tetap' : 'Kontrak'}
        </Badge>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const p = row.original
        return (
          <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => setEditPenghuni(p)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setDeletePenghuni(p)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Penghuni</h1>
          <p className="text-muted-foreground mt-1">Kelola data warga dan penghuni kontrak Rukun Tetangga.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="shadow-md hover:shadow-lg transition-all">
          <Plus className="mr-2 h-4 w-4" /> Tambah Penghuni
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-muted/50">
        <div className="flex items-center w-full max-w-sm relative">
          <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau NIK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white shadow-sm border-muted w-full"
          />
        </div>
      </div>

      {/* Split-Pane Dynamic Layout */}
      <div className={`grid grid-cols-1 gap-6 transition-all duration-500 ease-in-out ${selectedPenghuni ? 'lg:grid-cols-3' : ''}`}>
        {/* Kiri: Data Table */}
        <div className={`transition-all duration-500 ease-in-out ${selectedPenghuni ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="bg-white rounded-lg shadow-sm border border-muted/50 p-4">
            <DataTable 
              columns={columns} 
              data={data?.data || []} 
              isLoading={isLoading}
              pageCount={data?.meta?.total_pages || 1}
              pageIndex={page}
              pageSize={limit}
              totalItems={data?.meta?.total || 0}
              onPageChange={setPage}
              onPageSizeChange={(newLimit) => {
                setLimit(newLimit)
                setPage(1)
              }}
              onRowClick={(row) => {
                // Toggle detail pane jika baris yang sama diklik lagi
                setSelectedPenghuni(prev => prev?.id === row.id ? null : row)
              }}
              selectedRowId={selectedPenghuni?.id}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          </div>
        </div>

        {/* Kanan: Detail Pane */}
        {selectedPenghuni && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <PenghuniDetailPane 
                penghuni={selectedPenghuni} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreatePenghuniDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
      />
      <EditPenghuniDialog 
        open={!!editPenghuni} 
        onOpenChange={(open) => !open && setEditPenghuni(null)}
        penghuni={editPenghuni}
      />
      <DeletePenghuniDialog 
        open={!!deletePenghuni} 
        onOpenChange={(open) => !open && setDeletePenghuni(null)}
        penghuni={deletePenghuni}
      />
    </div>
  )
}
