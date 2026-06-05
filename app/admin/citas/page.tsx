import AppointmentTable from "./components/AppointmentTable"

export default function CitasPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Gestión de Citas</h2>
        <p className="text-sm text-gray-500 mt-1">
          Administra las citas y reservas del salón
        </p>
      </div>

      <AppointmentTable />
    </div>
  )
}
