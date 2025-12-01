class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Inertia.js のサポート
  inertia_share do
    {
      # 全てのページで共有するデータをここに追加
      # 例: current_user: current_user&.as_json(only: [:id, :name, :email])
    }
  end
end
