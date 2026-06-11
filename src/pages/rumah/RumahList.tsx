import { useState, useEffect } from "react"
import { useGetRumah } from "@/api/hooks/useRumah"
import type { Rumah } from "@/types/rumah"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, ArrowUpDown, Edit, Trash2, UserPlus, UserMinus } from "lucide-react"
import { CreateRumahDialog, EditRumahDialog, DeleteRumahDialog, AssignPenghuniDialog, CheckoutPenghuniDialog } from "@/components/rumah/RumahDialogs"
import { Badge } from "@/components/ui/badge"
import { RumahDetailPane } from "@/components/rumah/RumahDetailPane"

export default function RumahList() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Split-pane selection state
  const [selectedRumah, setSelectedRumah] = useState<Rumah | null>(null)

  // Sorting state
  const [sorting, setSorting] = useState<SortingState>([])

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editRumah, setEditRumah] = useState<Rumah | null>(null)
  const [deleteRumah, setDeleteRumah] = useState<Rumah | null>(null)
  const [assignRumah, setAssignRumah] = useState<Rumah | null>(null)
  const [checkoutRumah, setCheckoutRumah] = useState<Rumah | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
      setSelectedRumah(null)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch data
  const sortBy = sorting[0]?.id || 'blok_nomor'
  const sortDir = sorting[0]?.desc ? 'desc' : 'asc'
  const { data, isLoading } = useGetRumah(page, debouncedSearch, limit, sortBy, sortDir)

  // Sync selectedRumah with updated data (e.g. after edit)
  useEffect(() => {
    if (selectedRumah && data?.data) {
      const updated = data.data.find(r => r.id === selectedRumah.id)
      if (updated && updated !== selectedRumah) {
        setSelectedRumah(updated)
      } else if (!updated && !isLoading) {
        setSelectedRumah(null)
      }
    }
  }, [data, isLoading, selectedRumah])

  // Table Columns
  const columns: ColumnDef<Rumah>[] = [
    {
      accessorKey: "blok_nomor",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-muted/50"
          >
            Blok & Nomor
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const r = row.original;
        const hasUnpaid = r.is_filled && (r.tagihan_belum_bayar_count ?? 0) > 0;

        let dotColor = null;
        let tooltipText = "";

        if (!r.is_filled) {
          dotColor = "bg-gray-400";
          tooltipText = "Rumah Kosong";
        } else if (hasUnpaid) {
          dotColor = "bg-red-500";
          tooltipText = `${r.tagihan_belum_bayar_count} tagihan belum dibayar`;
        }

        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">Blok {r.blok_nomor}</span>
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
      accessorKey: "is_filled",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-muted/50"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        row.original.is_filled ? (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">Terisi</Badge>
        ) : (
          <Badge variant="secondary">Kosong</Badge>
        )
      )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const r = row.original
        return (
          <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
            {r.is_filled ? (
              <Button
                variant="outline"
                size="icon"
                title="Checkout Penghuni"
                className="h-8 w-8 text-orange-600 border-orange-200 hover:bg-orange-50"
                onClick={() => setCheckoutRumah(r)}
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                title="Assign Penghuni"
                className="h-8 w-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                onClick={() => setAssignRumah(r)}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => setEditRumah(r)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setDeleteRumah(r)}
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
          <h1 className="text-3xl font-bold tracking-tight">Data Rumah</h1>
          <p className="text-muted-foreground mt-1">Kelola data rumah dan status keterisian warga</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="shadow-md hover:shadow-lg transition-all">
          <Plus className="mr-2 h-4 w-4" /> Tambah Rumah
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-muted/50">
        <div className="flex items-center w-full max-w-sm relative">
          <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input
            placeholder="Cari blok / nomor rumah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white shadow-sm border-muted w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {/* Table Container - Takes full width if no selection, 2/3 if selection */}
        <div className={`transition-all duration-300 ease-in-out ${selectedRumah ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
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
              onRowClick={(row) => {
                setSelectedRumah(prev => prev?.id === row.id ? null : row)
              }}
              selectedRowId={selectedRumah?.id}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          </div>
        </div>

        {/* Detail Pane - slides in from the right */}
        {selectedRumah && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <RumahDetailPane rumah={selectedRumah} />
            </div>
          </div>
        )}
      </div>

      <CreateRumahDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <EditRumahDialog rumah={editRumah} open={!!editRumah} onOpenChange={(open) => !open && setEditRumah(null)} />
      <DeleteRumahDialog 
        rumah={deleteRumah} 
        open={!!deleteRumah} 
        onOpenChange={(open) => !open && setDeleteRumah(null)} 
        onSuccess={() => setSelectedRumah(null)}
      />
      <AssignPenghuniDialog 
        rumah={assignRumah} 
        open={!!assignRumah} 
        onOpenChange={(open) => !open && setAssignRumah(null)} 
        onSuccess={() => setSelectedRumah(null)}
      />
      <CheckoutPenghuniDialog 
        rumah={checkoutRumah} 
        open={!!checkoutRumah} 
        onOpenChange={(open) => !open && setCheckoutRumah(null)} 
        onSuccess={() => setSelectedRumah(null)}
      />
    </div>
  )
}
