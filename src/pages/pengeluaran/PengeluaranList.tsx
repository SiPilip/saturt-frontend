import { useState, useEffect } from "react"
import { useGetPengeluaran } from "@/api/hooks/usePengeluaran"
import type { Pengeluaran } from "@/types/pengeluaran"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, ArrowUpDown, Edit, Trash2 } from "lucide-react"
import { CreatePengeluaranDialog, EditPengeluaranDialog, DeletePengeluaranDialog } from "@/components/pengeluaran/PengeluaranDialogs"
import { Badge } from "@/components/ui/badge"

export default function PengeluaranList() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [jenisFilter, setJenisFilter] = useState("all")

  // Sorting state
  const [sorting, setSorting] = useState<SortingState>([])

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editPengeluaran, setEditPengeluaran] = useState<Pengeluaran | null>(null)
  const [deletePengeluaran, setDeletePengeluaran] = useState<Pengeluaran | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch data
  const sortBy = sorting[0]?.id || 'tanggal'
  const sortDir = sorting[0]?.desc ? 'desc' : 'asc'
  
  const { data, isLoading } = useGetPengeluaran(page, debouncedSearch, limit, jenisFilter, sortBy, sortDir)

  // Table Columns
  const columns: ColumnDef<Pengeluaran>[] = [
    {
      accessorKey: "tanggal",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-muted/50"
          >
            Tanggal
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <span className="text-muted-foreground font-medium">
          {new Date(row.original.tanggal).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })}
        </span>
      )
    },
    {
      accessorKey: "nama",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-muted/50"
          >
            Keterangan
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <span className="font-medium">{row.original.nama}</span>
    },
    {
      accessorKey: "jenis",
      header: "Jenis",
      cell: ({ row }) => {
        const jenis = row.original.jenis;
        let colorClass = "bg-gray-100 text-gray-800 border-gray-200";
        switch (jenis) {
          case 'gaji': colorClass = "bg-blue-100 text-blue-800 border-blue-200"; break;
          case 'operasional': colorClass = "bg-purple-100 text-purple-800 border-purple-200"; break;
          case 'perbaikan': colorClass = "bg-orange-100 text-orange-800 border-orange-200"; break;
        }
        
        return (
          <Badge variant="outline" className={`capitalize ${colorClass}`}>
            {jenis}
          </Badge>
        )
      }
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
            Total Biaya
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <span className="font-semibold text-red-600">
          Rp {row.original.biaya.toLocaleString("id-ID")}
        </span>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const p = row.original
        return (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => setEditPengeluaran(p)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setDeletePengeluaran(p)}
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
          <h1 className="text-3xl font-bold tracking-tight">Pengeluaran RT</h1>
          <p className="text-muted-foreground mt-1">Catat dan pantau seluruh arus keluar kas RT</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="shadow-md hover:shadow-lg transition-all">
          <Plus className="mr-2 h-4 w-4" /> Catat Pengeluaran
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-muted/50">
        <div className="flex items-center w-full max-w-sm relative">
          <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input
            placeholder="Cari keterangan pengeluaran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white shadow-sm border-muted w-full"
          />
        </div>
        
        <Select value={jenisFilter} onValueChange={(val) => { setJenisFilter(val); setPage(1); }}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Semua Jenis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jenis</SelectItem>
            <SelectItem value="operasional">Operasional</SelectItem>
            <SelectItem value="gaji">Gaji</SelectItem>
            <SelectItem value="perbaikan">Perbaikan</SelectItem>
            <SelectItem value="lainnya">Lainnya</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-muted/50 p-4">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          pageIndex={page}
          pageSize={limit}
          pageCount={data?.meta.total_pages || 1}
          totalItems={data?.meta.total || 0}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setLimit(size);
            setPage(1);
          }}
          sorting={sorting}
          onSortingChange={setSorting}
        />
      </div>

      <CreatePengeluaranDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <EditPengeluaranDialog pengeluaran={editPengeluaran} open={!!editPengeluaran} onOpenChange={(open) => !open && setEditPengeluaran(null)} />
      <DeletePengeluaranDialog 
        pengeluaran={deletePengeluaran} 
        open={!!deletePengeluaran} 
        onOpenChange={(open) => !open && setDeletePengeluaran(null)} 
      />
    </div>
  )
}
