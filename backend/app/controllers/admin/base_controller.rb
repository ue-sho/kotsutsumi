module Admin
  class BaseController < ApplicationController
    layout 'admin'

    # 将来的に管理者認証を追加
    # before_action :authenticate_admin!

    private

    def inertia_layout
      'admin'
    end
  end
end
