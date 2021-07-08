require "spec_helper"

describe ProconBypassMan::Web::Storage do
  describe '.migrate_if_pending_migration' do
    before do
      ProconBypassMan::Web::Db.recreate!
    end
    it do
      expect {
        ProconBypassMan::Web::Storage.db.execute("select * from users")
      }.to raise_error(SQLite3::SQLException, "no such table: users")
      ProconBypassMan::Web::Storage.migrate_if_pending_migration(migrations_path: "spec/lib/migration/*.sql")
      expect(ProconBypassMan::Web::Storage.db.execute("select * from schema_migrations").size).to eq(1)
      expect(ProconBypassMan::Web::Storage.db.execute("select * from users").size).to eq(0)
    end
  end

  describe '#pbm_dir_path' do
    before do
      ProconBypassMan::Web::Db.recreate!
      ProconBypassMan::Web::Storage.migrate_if_pending_migration
    end
    it do
      ProconBypassMan::Web::Storage.db.execute("select * from settings")
      # ProconBypassMan::Web::Storage.instance.pbm_dir_path
    end
  end

  describe '#pbm_setting_path' do
    before do
      ProconBypassMan::Web::Db.recreate!
      ProconBypassMan::Web::Storage.migrate_if_pending_migration
    end
    it do
      ProconBypassMan::Web::Storage.db.execute("select * from settings")
      # ProconBypassMan::Web::Storage.instance.pbm_setting_path
    end
  end
end
