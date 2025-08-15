import { AdminLog } from '@/lib/admin/admin-utils'

interface AdminLogsProps {
  logs: AdminLog[]
}

export default function AdminLogs({ logs }: AdminLogsProps) {
  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'insert':
        return '➕'
      case 'update':
        return '✏️'
      case 'delete':
        return '🗑️'
      default:
        return '📝'
    }
  }

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'insert':
        return 'bg-green-100 text-green-800'
      case 'update':
        return 'bg-blue-100 text-blue-800'
      case 'delete':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType.toLowerCase()) {
      case 'tenants':
        return '🏢'
      case 'products':
        return '📦'
      case 'jobs':
        return '🤖'
      case 'orders':
        return '🛒'
      default:
        return '📄'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Logs d&apos;Audit Admin</h3>
        <p className="text-sm text-gray-600 mt-1">Historique des actions administratives</p>
      </div>

      <div className="overflow-hidden">
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">Aucun log trouvé</div>
            <div className="text-gray-400 text-sm mt-2">Les actions administratives apparaîtront ici</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Icône d'action */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(log.action)}`}>
                      <span className="text-sm">{getActionIcon(log.action)}</span>
                    </div>
                  </div>

                  {/* Contenu principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm">{getResourceIcon(log.resource_type)}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {log.action.toUpperCase()} {log.resource_type}
                      </span>
                      {log.resource_id && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          ID: {log.resource_id.slice(0, 8)}...
                        </span>
                      )}
                    </div>

                    {/* Détails de l'action */}
                    <div className="text-sm text-gray-600 mb-3">
                      {log.action === 'INSERT' && (
                        <span>Nouveau {log.resource_type.slice(0, -1)} créé</span>
                      )}
                      {log.action === 'UPDATE' && (
                        <span>{log.resource_type.slice(0, -1)} modifié</span>
                      )}
                      {log.action === 'DELETE' && (
                        <span>{log.resource_type.slice(0, -1)} supprimé</span>
                      )}
                    </div>

                    {/* Changements détaillés */}
                    {log.action === 'UPDATE' && log.old_values && log.new_values && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="text-xs font-medium text-gray-700 mb-2">Changements :</div>
                        <div className="space-y-1">
                          {Object.keys(log.new_values).map((key) => {
                            const oldValue = log.old_values?.[key]
                            const newValue = log.new_values?.[key]
                            
                            if (oldValue !== newValue) {
                              return (
                                <div key={key} className="flex items-center space-x-2 text-xs">
                                  <span className="font-medium text-gray-600">{key}:</span>
                                  <span className="text-red-600 line-through">{String(oldValue)}</span>
                                  <span className="text-gray-400">→</span>
                                  <span className="text-green-600">{String(newValue)}</span>
                                </div>
                              )
                            }
                            return null
                          })}
                        </div>
                      </div>
                    )}

                    {/* Métadonnées */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        {log.admin_user && (
                          <span>Par: {log.admin_user.email}</span>
                        )}
                        {log.ip_address && (
                          <span>IP: {log.ip_address}</span>
                        )}
                      </div>
                      <span>{formatDate(log.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination ou info */}
      {logs.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Affichage des {logs.length} derniers logs</span>
            <span>Les logs sont conservés pendant 90 jours</span>
          </div>
        </div>
      )}
    </div>
  )
}
