class FixTypoForEnemyJungleMinions < ActiveRecord::Migration
  def change
    rename_column :performances, :neutral_minions_killed_enemey_jungle, :neutral_minions_killed_enemy_jungle
  end
end
