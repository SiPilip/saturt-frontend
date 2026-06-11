import { useState } from "react"
import { useGetTagihan } from "@/api/hooks/useTagihan"
import type { Tagihan } from "@/types/tagihan"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FilePlus, ArrowUpDown, Trash2, FilterX, CheckCircle } from "lucide-react"
import { GenerateTagihanDialog, DeleteTagihanDialog, PayTagihanManualDialog } from "@/components/tagihan/TagihanDialogs"

export default function TagihanList() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)
  
  // Filters
  const [filterBulan, setFilterBulan] = useState<string>("all")
  const [filterTahun, setFilterTahun] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Sorting state
  const [sorting, setSorting] = useState<SortingState>([])

  // Dialog states
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [deleteTagihan, setDeleteTagihan] = useState<Tagihan | null>(null)
  const [payManualTagihan, setPayManualTagihan] = useState<Tagihan | null>(null)

  const sortBy = sorting[0]?.id || 'created_at'
  const sortDir = sorting[0]?.desc ? 'desc' : 'asc'

  // Parse filters
  const parsedBulan = filterBulan === "all" ? undefined : parseInt(filterBulan)
  const parsedTahun = filterTahun === "all" ? undefined : parseInt(filterTahun)
  const parsedStatus = filterStatus === "all" ? null : filterStatus === "lunas"

  const { data, isLoading } = useGetTagihan(
    page, 
    limit, 
    sortBy, 
    sortDir, 
    parsedBulan, 
    parsedTahun, 
    parsedStatus
  )

  const handleResetFilters = () => {
    setFilterBulan("all")
    setFilterTahun("all")
    setFilterStatus("all")
    setPage(1)
  }

  // Generate Year Options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 1 + i).toString());

  // Table Columns
  const columns: ColumnDef<Tagihan>[] = [
    {
      accessorKey: "rumah",
      header: "Rumah",
      cell: ({ row }) => (
        <div className="font-semibold text-primary">
          Blok {row.original.rumah?.blok_nomor || '-'}
        </div>
      )
    },
    {
      accessorKey: "penghuni",
      header: "Penghuni",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.penghuni?.nama || 'Tidak ada penghuni'}
        </span>
      )
    },
    {
      accessorKey: "iuran",
      header: "Jenis Tagihan",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.iuran?.nama || '-'}</span>
      )
    },
    {
      id: "periode",
      header: "Periode",
      cell: ({ row }) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
        const b = row.original.bulan;
        const m = b >= 1 && b <= 12 ? monthNames[b - 1] : b;
        return <span>{m} {row.original.tahun}</span>;
      }
    },
    {
      accessorKey: "nominal",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 hover:bg-muted/50"
          >
            Nominal
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <span className="font-medium">
          Rp {row.original.nominal.toLocaleString('id-ID')}
        </span>
      )
    },
    {
      accessorKey: "is_paid",
      header: "Status",
      cell: ({ row }) => (
        row.original.is_paid ? (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">Lunas</Badge>
        ) : (
          <Badge variant="destructive">Belum Lunas</Badge>
        )
      )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const t = row.original
        return (
          <div className="flex items-center justify-end space-x-2">
             {!t.is_paid && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50 mr-2"
                  onClick={() => setPayManualTagihan(t)}
                  title="Lunaskan Manual"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setDeleteTagihan(t)}
                  title="Hapus Tagihan"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
             )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Tagihan</h1>
          <p className="text-muted-foreground mt-1">Kelola dan generate tagihan iuran rutin warga secara massal.</p>
        </div>
        <Button onClick={() => setIsGenerateOpen(true)} className="shadow-md hover:shadow-lg transition-all">
          <FilePlus className="mr-2 h-4 w-4" /> Generate Tagihan
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-muted/50">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground w-14">Bulan</span>
          <Select value={filterBulan} onValueChange={(val) => { setFilterBulan(val); setPage(1); }}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Semua Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Bulan</SelectItem>
              {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((m, i) => (
                <SelectItem key={i+1} value={(i+1).toString()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground w-14">Tahun</span>
          <Select value={filterTahun} onValueChange={(val) => { setFilterTahun(val); setPage(1); }}>
            <SelectTrigger className="w-[120px] bg-white">
              <SelectValue placeholder="Semua Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {years.map(y => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground w-14">Status</span>
          <Select value={filterStatus} onValueChange={(val) => { setFilterStatus(val); setPage(1); }}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="lunas">Lunas</SelectItem>
              <SelectItem value="belum">Belum Lunas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(filterBulan !== "all" || filterTahun !== "all" || filterStatus !== "all") && (
          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-muted-foreground hover:text-foreground">
            <FilterX className="mr-2 h-4 w-4" /> Reset Filter
          </Button>
        )}
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

      <GenerateTagihanDialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen} />
      <DeleteTagihanDialog 
        tagihan={deleteTagihan} 
        open={!!deleteTagihan} 
        onOpenChange={(open) => !open && setDeleteTagihan(null)} 
      />
      <PayTagihanManualDialog
        tagihan={payManualTagihan}
        open={!!payManualTagihan}
        onOpenChange={(open) => !open && setPayManualTagihan(null)}
      />
    </div>
  )
}
