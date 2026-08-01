import { Pill, Calendar } from "lucide-react"

export default function MedicineTrackSection({ medicines }: { medicines: any[] }) {
  const isActive = (endDate: string) => {
    return new Date(endDate) > new Date()
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Pill className="h-5 w-5 text-primary" />
        Medicine Tracker
      </h3>

      {medicines.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No medicines assigned</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {medicines.map((medicine) => {
            const active = isActive(medicine.endDate)
            return (
              <div
                key={medicine._id}
                className={`p-3 rounded-lg border transition-colors ${
                  active ? "bg-secondary/5 border-secondary/20" : "bg-muted/5 border-muted/20"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-sm text-foreground">{medicine.name}</div>
                  {active ? (
                    <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded">Active</span>
                  ) : (
                    <span className="px-2 py-1 bg-muted/20 text-muted-foreground text-xs font-medium rounded">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="font-medium">Dosage: {medicine.dosage}</div>
                  <div>Frequency: {medicine.frequency}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(medicine.startDate).toLocaleDateString()} to{" "}
                    {new Date(medicine.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
