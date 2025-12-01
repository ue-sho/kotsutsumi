module Admin
  class DashboardController < BaseController
    def index
      render inertia: 'Admin/Dashboard/Index', props: {
        stats: {
          total_users: 0, # 仮データ
          active_users: 0,
          total_work_logs: 0,
          new_users_today: 0
        }
      }
    end
  end
end
