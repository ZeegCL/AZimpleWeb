using System;
using MySql.Data.MySqlClient;
using AZimpleWeb.Services;

namespace AZimpleWeb.Models
{
    public enum Faction
    {
        ALLIANCE = 0,
        HORDE
    }

    public class RealmInfo : DatabaseConsumer
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public short Flags { get; set; }
        public int GameBuild { get; set; }

        public RealmInfo(string connectionString) 
        : base(connectionString) {}

        public long GetOnlinePlayersCount()
        {
            long count = 0;

            using (MySqlConnection conn = this.GetConnection())
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "SELECT count(*) FROM characters WHERE online > 0";
                conn.Open();

                count = (long)cmd.ExecuteScalar();
            }

            return count;
        }

        public long GetFactionOnlinePlayersCount(Faction factionId)
        {
            long count = 0;
            string[] races = new string[2];
            races[(int)Faction.ALLIANCE] = "1, 3, 4, 7, 11";
            races[(int)Faction.HORDE] = "2, 5, 6, 8, 10";

            using (MySqlConnection conn = GetConnection())
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = $"SELECT count(*) FROM characters WHERE online > 0 AND race IN ({races[(int)factionId]})";
                conn.Open();

                count = (long)cmd.ExecuteScalar();
            }

            return count;
        }

        public static string GetRealmType(int icon)
        {
            switch (icon)
            {
                
                case 1:
                    return "PvP";
                case 6:
                    return "Roleplaying";
                case 8:
                    return "Roleplaying PvP";
                case 0:
                case 4:
                default:
                    return "Normal";
            }
        }
    }
}