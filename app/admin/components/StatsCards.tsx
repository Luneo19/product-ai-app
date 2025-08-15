interface StatsCardsProps {
  stats: {
    total_tenants: number
    total_products: number
    total_jobs: number
    total_orders: number
    active_tenants: number
    monthly_revenue: number
  }
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Tenants',
      value: stats.total_tenants,
      change: '+12%',
      changeType: 'increase',
      icon: '🏢',
      color: 'blue'
    },
    {
      title: 'Tenants Actifs',
      value: stats.active_tenants,
      change: '+8%',
      changeType: 'increase',
      icon: '✅',
      color: 'green'
    },
    {
      title: 'Total Produits',
      value: stats.total_products,
      change: '+23%',
      changeType: 'increase',
      icon: '📦',
      color: 'purple'
    },
    {
      title: 'Générations IA',
      value: stats.total_jobs,
      change: '+45%',
      changeType: 'increase',
      icon: '🤖',
      color: 'indigo'
    },
    {
      title: 'Commandes',
      value: stats.total_orders,
      change: '+18%',
      changeType: 'increase',
      icon: '🛒',
      color: 'orange'
    },
    {
      title: 'Revenus Mensuels',
      value: `€${stats.monthly_revenue.toLocaleString()}`,
      change: '+32%',
      changeType: 'increase',
      icon: '💰',
      color: 'emerald'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      indigo: 'bg-indigo-50 text-indigo-600',
      orange: 'bg-orange-50 text-orange-600',
      emerald: 'bg-emerald-50 text-emerald-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(card.color)}`}>
              <span className="text-xl">{card.icon}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${
              card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {card.change}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs mois dernier</span>
          </div>
        </div>
      ))}
    </div>
  )
}
