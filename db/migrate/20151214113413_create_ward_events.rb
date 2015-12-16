class CreateWardEvents < ActiveRecord::Migration
  def change
    create_table :ward_events do |t|
      
      t.integer :summoner_id
      t.integer :match_id
      t.integer :riot_timestamp
      t.string :ward_type
      t.string :event_type

      t.timestamps null: false
    end
  end
end
