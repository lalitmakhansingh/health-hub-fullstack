"use client"

import { useState } from "react"
import { Plus, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiFetch } from "@/lib/api"

export default function AddMedicineSection({
  onMedicineAdded,
}: {
  onMedicineAdded: (medicine: any) => void
}) {
  const [name, setName] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "Medicine name is required"
    if (!dosage.trim()) newErrors.dosage = "Dosage is required"
    if (!frequency.trim()) newErrors.frequency = "Frequency is required"
    if (!startDate) newErrors.startDate = "Start date is required"
    if (!endDate) newErrors.endDate = "End date is required"
    if (startDate && endDate && endDate < startDate) {
      newErrors.endDate = "End date must be after start date"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const { medicine } = await apiFetch("/api/medicines", {
        method: "POST",
        body: JSON.stringify({ name, dosage, frequency, startDate, endDate }),
      })

      onMedicineAdded(medicine)
      setSuccess(true)
      setName("")
      setDosage("")
      setFrequency("")
      setStartDate("")
      setEndDate("")
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setErrors({ submit: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" />
        Add Medicine
      </h3>

      {success && (
        <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-lg flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
          <span className="text-foreground">Medicine added successfully!</span>
        </div>
      )}

      {errors.submit && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
          <span className="text-foreground">{errors.submit}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="med-name" className="text-sm">Medicine Name</Label>
          <Input
            id="med-name"
            placeholder="e.g. Aspirin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="med-dosage" className="text-sm">Dosage</Label>
            <Input
              id="med-dosage"
              placeholder="e.g. 500mg"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              disabled={isLoading}
            />
            {errors.dosage && <p className="text-xs text-destructive">{errors.dosage}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="med-frequency" className="text-sm">Frequency</Label>
            <Input
              id="med-frequency"
              placeholder="e.g. 2x daily"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              disabled={isLoading}
            />
            {errors.frequency && <p className="text-xs text-destructive">{errors.frequency}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="med-start" className="text-sm">Start Date</Label>
            <Input
              id="med-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isLoading}
            />
            {errors.startDate && <p className="text-xs text-destructive">{errors.startDate}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="med-end" className="text-sm">End Date</Label>
            <Input
              id="med-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isLoading}
            />
            {errors.endDate && <p className="text-xs text-destructive">{errors.endDate}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Medicine"}
        </Button>
      </form>
    </div>
  )
}